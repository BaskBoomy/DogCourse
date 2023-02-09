import {
  concurrent,
  filter,
  map,
  pipe,
  sortBy,
  toArray,
  toAsync
} from '@fxts/core';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MapToBizHourInfo, MapToCarResult, MapToTransportResult } from 'src/helper/mapping';
import { getQueryString } from 'src/helper/query';
import { NAVER_SEARCH_URL, PLACE_INFO_URL } from 'src/helper/url';
import { Car, NaverOptionId, NaverSearchResult, NaverSearchURLParam, NaverTrafficResult, StartToGoalParam, Transport, Walk } from 'src/type/naver/types';
import { GoogleAPIService } from '../googleAPI/googleAPI.service';
import { MapToWalkResult } from './../../helper/mapping';

@Injectable()
export class NaverAPIService {
  constructor(
    private httpSerivce: HttpService,
    private readonly googleAPIService: GoogleAPIService) {}

  async getPetFriendlyList(type:string,address:string): Promise<NaverSearchResult[]> {
    //구글 MAP API를 통해 입력받은 주소지의 좌표 반환
    const searchCoord = await this.googleAPIService.getXYCoordinate(
      address as string,
    );

    const param:NaverSearchURLParam = {
      query: type,
      type: 'all',
      searchCoord,
      displayCount: 100,
      isPlaceRecommendationReplace: true,
      lang: 'ko',
    };
    
    //전체 검색 결과
    const naverSearchResultList = 
        await firstValueFrom(this.httpSerivce.get(NAVER_SEARCH_URL(param)))
            .then((res) => res.data.result.place.list);

    //반려동물 동반 가능한 장소 리스트
    const petFriendlyPlaceList: NaverSearchResult[] = await pipe(
      naverSearchResultList,
      toAsync,
      map(
        async (place: NaverSearchResult): Promise<NaverSearchResult> =>
          await firstValueFrom(
            this.httpSerivce.get(PLACE_INFO_URL(place.id)),
          ).then((res) => {
            return {
              ...res.data,
              workingStatus: {
                id:MapToBizHourInfo(place.bizhourInfo),
                status: place.bizhourInfo ? place.bizhourInfo : '영업정보 없음',
              },
            };
          }),
      ),
      concurrent(naverSearchResultList.length),
      filter((place) =>
        place.options.find((opt) => opt.id == NaverOptionId.DOGFRIENDLY),
      ),
      sortBy((place) => place.workingStatus.id),
      toArray,
    );
    return petFriendlyPlaceList;
  }

  async getTransport(traffic:StartToGoalParam):Promise<NaverTrafficResult>{
    const param:Transport = {
      start:`${traffic.lng},${traffic.lat}`, 
      goal:`${traffic.dlng},${traffic.dlat}`, 
      departureTime:'2023-02-03T15:25:34',
      crs:'EPSG:4326', 
      mode:'TIME',  
      lang:'ko'
    }
    const transportInfo = 
      await firstValueFrom(this.httpSerivce.get(`https://map.naver.com/v5/api/transit/directions/point-to-point?${getQueryString(param)}`))
        .then((res)=>MapToTransportResult(param,res.data));
    
    return transportInfo;
  }
  
  async getCar(traffic:StartToGoalParam):Promise<NaverTrafficResult>{
    const param:Car = {
      start:`${traffic.lng},${traffic.lat}`, 
      goal:`${traffic.dlng},${traffic.dlat}`, 
      crs:'EPSG:4326', 
      mode:'TIME', 
      rptype:4,
      cartype:1, 
      fueltype:1, 
      lang:'ko'
    }
    const carInfo = 
      await firstValueFrom(this.httpSerivce.get(`https://map.naver.com/v5/api/dir/findcar?${getQueryString(param)}`))
        .then((res)=>MapToCarResult(param,res.data));

    return carInfo;
  }
  
  async getWalk(traffic:StartToGoalParam):Promise<NaverTrafficResult>{
    const param:Walk = {
      l:`${traffic.lng},${traffic.lat};${traffic.dlng},${traffic.dlat}`, 
      st:1,
      o:'all',
      lang:'ko'
    }
    const walkInfo = 
      await firstValueFrom(this.httpSerivce.get(`https://map.naver.com/v5/api/dir/findwalk?${getQueryString(param)}`))
        .then((res)=>MapToWalkResult(param,res.data));

    return walkInfo;
  }
}
