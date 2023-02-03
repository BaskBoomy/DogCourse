import { KakaoBlockId, KakaoOutput } from './../type/kakao/types';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { GoogleAPIService } from 'src/googleAPI/googleAPI.service';
import {
  BizHour,
  Car,
  NaverOption,
  NaverOptionId,
  NaverSearchResult,
  NaverTrafficParams,
  NaverTrafficResult,
  Transport,
  Walk,
} from 'src/type/naver/types';
import {
  KakaoBotButton,
  KakaoBotBasicCard,
  KaKaoChatBotParam,
  KakaoResponseBody,
} from 'src/type/kakao/types';
import {
  concurrent,
  filter,
  map,
  pipe,
  sortBy,
  toArray,
  toAsync,
  reduce,
  fromEntries,
} from '@fxts/core';
import { quickReplies, textResponse } from 'src/type/kakao/response_datas';
import { NAVER_MAP_URL, NAVER_SEARCH_URL, PLACE_INFO_URL } from 'src/API/api';
import { getQueryString } from 'src/helper/query';
import { MapToCarResult, MapToTransportResult, MapToWalkResult } from 'src/helper/mapping';

@Injectable()
export class PlaceService {
  constructor(
    private readonly httpSerivce: HttpService,
    private readonly googleAPISerive: GoogleAPIService,
  ) {}
  async getDogFriendlyPlace(data: KaKaoChatBotParam):Promise<KakaoResponseBody> {
    try {
      const { type, address } =
        Object.keys(data.action.clientExtra).length !== 0
          ? data.action.clientExtra
          : data.action.params;
      console.log(address, type);

      //구글 MAP API를 통해 입력받은 주소지의 좌표 반환
      const searchCoord = await this.googleAPISerive.getXYCoordinate(
        address as string,
      );

      const param = {
        query: type,
        type: 'all',
        searchCoord,
        displayCount: 100,
        isPlaceRecommendationReplace: true,
        lang: 'ko',
      };

      //전체 검색 결과
      const naverSearchResultList = await firstValueFrom(
        this.httpSerivce.get(NAVER_SEARCH_URL(param)),
      ).then((res) => res.data.result.place.list);

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
                  id:
                    place.bizhourInfo == '영업 중'
                      ? 1
                      : place.bizhourInfo == '곧 영업 종료'
                      ? 2
                      : place.bizhourInfo == '영업 종료'
                      ? 3
                      : 4,
                  status: place.bizhourInfo,
                },
              };
            }),
        ),
        concurrent(100),
        filter((place) =>
          place.options.find((opt) => opt.id == NaverOptionId.DOGFRIENDLY),
        ),
        sortBy((place) => place.workingStatus.id),
        toArray,
      );

      //카카오 챗봇 template으로 데이터 mapping
      const mappedKakaoResponse: KakaoBotBasicCard[] = pipe(
        petFriendlyPlaceList,
        map((dog_place): KakaoBotBasicCard => {
          let buttons: KakaoBotButton[] = [];
          dog_place.phone &&
            buttons.push({
              action: 'phone',
              label: '전화',
              phoneNumber: dog_place.phone,
            });

          buttons.push({
            action: 'block',
            label: '자세히',
            blockId: KakaoBlockId['장소 정보'],
            extra: {
              placeId: String(dog_place.id),
            },
          });
          buttons.push({
            action: 'share',
            label: '공유',
          });
          return {
            title: dog_place.name,
            description: `[${dog_place.workingStatus.status}]\n${dog_place.address}`,
            thumbnail: {
              imageUrl: dog_place.imageURL,
              link: {
                web: NAVER_MAP_URL(param.query, dog_place.id),
              },
            },
            buttons,
          };
        }),
        // take(10),
        toArray,
      );

      //좌표값으로 지도에서 조회
      let position = pipe(
        petFriendlyPlaceList,
        filter((p) => p.name),
        map((p) => [p.name, [p.y, p.x]] as [string, [number, number]]),
        fromEntries,
      );

      console.log(position);
      const showMap: KakaoBotBasicCard = {
        thumbnail: {
          imageUrl: `https://res.cloudinary.com/dcizjmtey/image/upload/v1675331825/map-small_pghzpa.png`,
        },
        description:'✅ 검색결과를 지도로 한눈에 볼 수 있어요!',
        buttons: [
          {
            action: 'webLink',
            label: '지도로 보기',
            webLinkUrl: `https://1319-221-148-27-89.jp.ngrok.io/map?center=${searchCoord}&${getQueryString(
              position,
            )}`,
          },
        ],
      };

      const responseBody: KakaoResponseBody = {
        version: '2.0',
        template: petFriendlyPlaceList
          ? {
              outputs: [
                {
                  carousel: {
                    type: 'basicCard',
                    items: [showMap,...mappedKakaoResponse],
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

  async getTrafficInfo(params:NaverTrafficParams[]):Promise<any>{
    try{
      const transport = await pipe(
        params,
        toAsync,
        map(async (param)=> {
          const transportParam:Transport = {
            start:param.start, 
            goal:param.goal, 
            departureTime:'2023-02-03T15:25:34',
            crs:param.crs, 
            mode:param.mode,  
            lang:param.lang}
          return await firstValueFrom(this.httpSerivce.get(`https://map.naver.com/v5/api/transit/directions/point-to-point?${getQueryString(transportParam)}`))
          .then((res)=>MapToTransportResult(param,res.data))}),
        concurrent(params.length),
        toArray
      )
  
      const car = await pipe(
        params,
        toAsync,
        map(async (param)=>{
          const carParam:Car = {
            start:param.start, 
            goal:param.goal, 
            crs:param.crs, 
            mode:param.mode, 
            rptype:param.rptype, 
            cartype:param.cartype, 
            fueltype:param.fueltype, 
            lang:param.lang}
          return await firstValueFrom(this.httpSerivce.get(`https://map.naver.com/v5/api/dir/findcar?${getQueryString(carParam)}`))
            .then((res)=>MapToCarResult(param,res.data))}),
        concurrent(params.length),
        toArray
      )

      const walk = await pipe(
        params,
        toAsync,
        map(async (param)=>{
          const carParam:Walk = {
            l:param.l, 
            st:param.st, 
            o:param.o, 
            lang:param.lang}
          return await firstValueFrom(this.httpSerivce.get(`https://map.naver.com/v5/api/dir/findwalk?${getQueryString(carParam)}`))
            .then((res)=>MapToWalkResult(param,res.data))}),
        concurrent(params.length),
        toArray
      )
      return {
        transport,
        car,
        walk
      };
    }catch(e){
      throw e;
    }
    
  }
}
