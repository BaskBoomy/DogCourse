import { entries, reduce } from '@fxts/core';
import { KakaoBlockId } from './../type/kakao/types';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { GoogleAPIService } from 'src/googleAPI/googleAPI.service';
import { BizHour, NaverOptionId, NaverSearchResult } from 'src/type/naver/types';
import { KakaoBotButton, KakaoBotBasicCard, KaKaoChatBotParam, KakaoResponseBody } from 'src/type/kakao/types';
import { concurrent, filter, map, pipe, sortBy, toArray, toAsync } from '@fxts/core';
import { quickReplies, textResponse } from 'src/type/kakao/response_datas';
import { NAVER_MAP_URL, NAVER_SEARCH_URL, PLACE_INFO_URL } from 'src/API/api';

@Injectable()
export class PlaceService {
  private readonly logger = new Logger(PlaceService.name);
  constructor(
    private readonly httpSerivce: HttpService,
    private readonly googleAPISerive: GoogleAPIService,
  ) {}
  async getDogFriendlyPlace(data:KaKaoChatBotParam):Promise<KakaoResponseBody> {
    const { type, address } = data.action.params;
    
    try {
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
      const naverSearchResultList = 
        await firstValueFrom(this.httpSerivce.get(NAVER_SEARCH_URL(param)))
          .then((res)=>res.data.result.place.list);
        
      //반려동물 동반 가능한 장소 리스트
      const petFriendlyPlaceList: KakaoBotBasicCard[] = await pipe(
        naverSearchResultList,
        toAsync,
        map(async (place: { id: string;bizhourInfo:string }):Promise<NaverSearchResult> =>
            await firstValueFrom(this.httpSerivce.get(PLACE_INFO_URL(place.id)))
              .then((res) => {
                return {
                  ...res.data,
                  bizhourInfo: {
                    id : place.bizhourInfo == '영업 중' ? 1 : place.bizhourInfo == '곧 영업 종료' ? 2 : place.bizhourInfo == '영업 종료' ? 3 : 4,
                    status: place.bizhourInfo
                  }
                }
              })),
        concurrent(100),
        filter((place) => place.options.find((opt) => opt.id == NaverOptionId.DOGFRIENDLY)),
        sortBy((place)=>place.bizhourInfo.id),
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
            extra:{
              'placeId': String(dog_place.id)
            }
          });
          buttons.push({
            action: 'share',
            label: '공유'
          });
          return {
            title: dog_place.name,
            description: `[${dog_place.bizhourInfo.status}]\n${dog_place.address}`,
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

      const responseBody : KakaoResponseBody= {
        version: "2.0",
        template: petFriendlyPlaceList
          ? {
              outputs: [
                { carousel: { type: "basicCard", items: petFriendlyPlaceList } },
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
              quickReplies:quickReplies.DEFAULT,
            },
      };
      return responseBody;

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getPlaceInfo(data:KaKaoChatBotParam):Promise<KakaoResponseBody>{
    try{
      const placeId = data.action.clientExtra.placeId;
      const placeInfo = 
        await firstValueFrom(this.httpSerivce.get(PLACE_INFO_URL(placeId)))
        .then((res)=>res.data);

      const workHour = pipe(
        placeInfo.bizHour as BizHour[],
        filter((b)=>b.isDayOff == false),
        map(b=>`[${b.type}] : ${b.startTime}~${b.endTime}\n`),
        reduce((a,b)=>a+b),
      )
      
      const responseBody:KakaoResponseBody = {
        version: "2.0",
        template: {
          outputs: [
            {
              basicCard: {
                title: `${placeInfo.name}\n${placeInfo.address}`,
                description: `${placeInfo.description}\n\n⏲영업일\n${workHour}`,
                thumbnail:{
                  imageUrl:placeInfo.imageURL,
                },
                buttons:[
                  {
                    action:'webLink',
                    label:'지도',
                    webLinkUrl:NAVER_MAP_URL(placeInfo.name,placeInfo.id)
                  }
                ]
              },
            },
            {
              carousel:{
                type:'basicCard',
                items:placeInfo.images.map(img=>{return {thumbnail:img.url}})
              }
            }
          ]
        }
      };
      return responseBody;
    }catch(e){
      throw e;
    }
  }
}
