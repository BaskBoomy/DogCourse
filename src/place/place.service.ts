import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios/dist';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlaceInfo } from 'src/dto/place/placeinfo';
import { GoogleAPIService } from 'src/googleAPI/googleAPI.service';
import { getQueryString } from 'src/helper/query';
import { NaverOption, NaverOptionId, NaverSearchQueryParams, NaverSearchResult } from 'src/type/naver/types';
import { KakaoBotButton, KakaoBotPetFriendlyResult, KakaoResponseBody } from 'src/type/kakao/types';
import { concurrent, filter, map, pipe, take, toArray, toAsync } from '@fxts/core';
import { quickReplies, textResponse } from 'src/type/kakao/response_datas';
import { NAVER_MAP_URL, NAVER_SEARCH_URL, PLACE_INFO_URL } from 'src/API/api';

@Injectable()
export class PlaceService {
  private readonly logger = new Logger(PlaceService.name);
  constructor(
    private readonly httpSerivce: HttpService,
    private readonly googleAPISerive: GoogleAPIService,
  ) {}
  async getDogFriendlyPlace(data) {
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
        
      // this.logger.log('httpSerive testing..', naverSearchResultList);
      //반려동물 동반 가능한 장소 리스트
      const petFriendlyPlaceList: KakaoBotPetFriendlyResult[] = await pipe(
        naverSearchResultList,
        toAsync,
        map(
          async (place: { id: string }) =>
            await firstValueFrom(this.httpSerivce.get(PLACE_INFO_URL(place.id)))
              .then((res) => res.data)),
        concurrent(100),
        filter((place: NaverSearchResult) =>
          place.options.find(
            (d: NaverOption) => d.id == NaverOptionId.DOGFRIENDLY,
          ),
        ),
        map((dog_place: NaverSearchResult): KakaoBotPetFriendlyResult => {
          let buttons: KakaoBotButton[] = [
            {
              action: 'webLink',
              label: '지도',
              webLinkUrl: NAVER_MAP_URL(param.query, dog_place.id),
            },
          ];
          dog_place.urlList[0] &&
            buttons.push({
              action: 'webLink',
              label: '홈페이지',
              webLinkUrl: dog_place.urlList[0].url,
            });
          dog_place.phone &&
            buttons.push({
              action: 'phone',
              label: '전화',
              phoneNumber: dog_place.phone,
            });

          return {
            title: dog_place.name,
            description: dog_place.address,
            thumbnail: {
              imageUrl: dog_place.imageURL,
              link: {
                web: NAVER_MAP_URL(param.query, dog_place.id),
              },
            },
            buttons,
          };
        }),
        take(10),
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
}
