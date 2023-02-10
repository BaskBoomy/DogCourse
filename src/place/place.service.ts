import {
  concurrent,
  filter, map,
  pipe, reduce, take, toArray, toAsync
} from '@fxts/core';
import { HttpService } from '@nestjs/axios/dist';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { NaverAPIService } from 'src/api/naverAPI/naverAPI.service';
import { MapToKakaoTemplateResult } from 'src/helper/mapping';
import { getQueryString } from 'src/helper/query';
import { NAVER_MAP_URL, PLACE_INFO_URL } from 'src/helper/url';
import { quickReplies, textResponse } from 'src/type/kakao/response_datas';
import {
  KakaoBotBasicCard,
  KaKaoChatBotParam,
  KakaoResponseBody
} from 'src/type/kakao/types';
import {
  BizHour, NaverMapResult, NaverOption, NaverSearchParam
} from 'src/type/naver/types';
import { KakaoOutput } from './../type/kakao/types';

@Injectable()
export class PlaceService {
  constructor(
    private readonly httpSerivce: HttpService,
    private readonly naverAPIService: NaverAPIService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache
  ) {}
  async getDogFriendlyPlace(data: KaKaoChatBotParam):Promise<KakaoResponseBody> {
    try {
      const { type, address } =
        Object.keys(data.action.clientExtra).length !== 0
          ? data.action.clientExtra
          : data.action.params;
      console.log(address, type);

      //반려동물 동반 장소 리스트
      const petFriendlyPlaceList = await this.naverAPIService.getPetFriendlyList(type,address);

      //카카오 챗봇 template으로 데이터 mapping
      const mappedKakaoResponse: KakaoBotBasicCard[] = pipe(
        petFriendlyPlaceList,
        map((dog_place)=>MapToKakaoTemplateResult(dog_place,type)),
        take(25),
        toArray,
      );

      const param = {
        type,address,
        centerLat:petFriendlyPlaceList[0].y,
        centerLng:petFriendlyPlaceList[0].x
      }

      const showMap: KakaoBotBasicCard = {
        thumbnail: {
          imageUrl: `https://res.cloudinary.com/dcizjmtey/image/upload/v1675331825/map-small_pghzpa.png`,
        },
        description:'✅ 검색결과를 지도로 한눈에 볼 수 있어요!\n✅ 목적지까지 예상시간을 알 수 있어요!',
        buttons: [
          {
            action: 'webLink',
            label: '지도로 보기',
            webLinkUrl: `${process.env.DOGCOURSE_URL}/map?${getQueryString(param)}`,
          },
        ],
      };

      console.log(`store count : ${petFriendlyPlaceList.length}`);
      const responseBody: KakaoResponseBody = {
        version: '2.0',
        template: petFriendlyPlaceList
          ? {
              outputs: [
                {
                  carousel: {
                    type: 'basicCard',
                    items: [...mappedKakaoResponse,showMap],
                  },
                },
              ],
            }
          : {
              outputs: [
                {
                  simpleText: {
                    text: textResponse.NOPLACE,
                  },
                },
              ],
              quickReplies: quickReplies.DEFAULT,
            },
      };
      return responseBody;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getPlaceInfo(data: KaKaoChatBotParam): Promise<KakaoResponseBody> {
    try {
      const placeId = data.action.clientExtra.placeId;
      const placeInfo = await firstValueFrom(
        this.httpSerivce.get(PLACE_INFO_URL(placeId)),
      ).then((res) => res.data);

      const workHour = pipe(
        placeInfo.bizHour as BizHour[],
        filter((b) => b.isDayOff == false),
        map((b) => `[${b.type}] : ${b.startTime}~${b.endTime}\n`),
        reduce((a, b) => a + b),
      );
      const option = pipe(
        placeInfo.options as NaverOption[],
        map((o) => `${o.name} `),
        reduce((a, b) => a + b),
      );
      const simpleAddress = `${placeInfo.addressAbbr.split(' ')[0]}`;

      const outputs: KakaoOutput[] = [];
      outputs.push({
        basicCard: {
          title: placeInfo.name,
          description: `${placeInfo.address}\n💡옵션\n${option}\n\n⏲영업일\n${workHour}`,
          thumbnail: {
            imageUrl: placeInfo.imageURL,
          },
          buttons: [
            {
              action: 'webLink',
              label: '지도',
              webLinkUrl: NAVER_MAP_URL(placeInfo.name, placeInfo.id),
            },
          ],
        },
      });
      placeInfo.description.length > 0 &&
        outputs.push({
          simpleText: {
            text: `📖저희는요~! \n${placeInfo.description}`,
          },
        });
      outputs.push({
        carousel: {
          type: 'basicCard',
          items: placeInfo.images.map((img) => {
            return { thumbnail: img.url };
          }),
        },
      });
      const responseBody: KakaoResponseBody = {
        version: '2.0',
        template: {
          outputs,
          quickReplies: [
            {
              label: `주변 카페`,
              action: 'message',
              messageText: `${simpleAddress} 카페`,
            },
            {
              label: `주변 음식점`,
              action: 'message',
              messageText: `${simpleAddress} 음식점`,
            },
          ],
        },
      };
      return responseBody;
    } catch (e) {
      throw e;
    }
  }

  async getTrafficInfo(params:NaverSearchParam):Promise<NaverMapResult[]>{
    try{
      const {currentLat, currentLng, type, address} = params;
      console.log('getTrafficInfo: finding cache!');
      const cache = await this.cacheService.get<NaverMapResult[]>(`${currentLat},${currentLng},${type},${address}`);
      if(cache){
        console.log('getTrafficInfo: cache found!');
        return cache;
      }
      console.log('getTrafficInfo: cache missed');
      console.time('petFriendlyPlaceList');
      const petFriendlyPlaceList = await this.naverAPIService.getPetFriendlyList(type,address);
      console.timeEnd('petFriendlyPlaceList');
      
      console.time('mapping');
      const result = await pipe(
        petFriendlyPlaceList,
        toAsync,
        map(async (place)=>{
          let param = {lng:currentLng,lat:currentLat,dlng:place.x,dlat:place.y}
          return {
            name:place.name,
            address:place.address,
            lat:place.y.toString(),
            lng:place.x.toString(),
            options:pipe(place.options,map(o=>`${o.name}, `),reduce((a,b)=>a+b)),
            images:pipe(place.images,map(i=>i.url),toArray),
            status:place.workingStatus.status,
            phone:place.phone,
            shareLink:`https://m.place.naver.com/share?id=${place.id}`,
            naverMapLink:`nmap://route/car?slat=${currentLat}&slng=${currentLng}&dlat=${place.y}&dlng=${place.x}&dname=${place.name}&appname=DogCourse`,
            transport : await this.naverAPIService.getTransport(param),
            car : await this.naverAPIService.getCar(param),
            walk : await this.naverAPIService.getWalk(param)
          }
        }),
        concurrent(petFriendlyPlaceList.length),
        toArray
      )
      console.timeEnd('mapping');
      console.log('getTrafficInfo: cache saving..');
      await this.cacheService.set(`${currentLat},${currentLng},${type},${address}`,result,+process.env.CACHE_TTL);
      console.log('getTrafficInfo: cache stored..');
      return result;
    }catch(e){
      throw e;
    }
    
  }
}
