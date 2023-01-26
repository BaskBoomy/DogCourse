import { NaverOptionId } from './../type/naver/types';
import axios from "axios";
import { pipe,map,toArray,toAsync,filter,concurrent,take, find } from "@fxts/core";
import { getXYCoordinate } from "../helper/geolocation";
import { getQueryString } from "../helper/query";
import { NaverSearchResult, NaverOption, NaverSearchQueryParams } from "type/naver/types";
import { KakaoBotButton,KakaoBotPetFriendlyResult} from "./../type/kakao/types";
require("console-stamp")(console, 'yyyy/mm/dd HH:MM:ss'); 

const NAVER_SEARCH_URL = (params:NaverSearchQueryParams) => `https://map.naver.com/v5/api/search?${getQueryString(params)}`;
const PLACE_INFO_URL = (id:string) => `https://map.naver.com/v5/api/sites/summary/${id}?lang=ko`;
const NAVER_MAP_URL = (type:string,id:number|string) => `https://map.naver.com/v5/search/${type}/place/${id}`;

export const getPetFriendlyList = async (type: string, address: string) => {
  try {
    //구글 MAP API를 통해 입력받은 주소지의 좌표 반환
    const searchCoord = await getXYCoordinate(address as string);
    console.log(searchCoord);

    const param = {
      query: type,
      type: "all",
      searchCoord,
      displayCount: 100,
      isPlaceRecommendationReplace: true,
      lang: "ko",
    };

    //전체 검색 결과
    const naverSearchResultList = 
      await axios(NAVER_SEARCH_URL(param)).then((res: any) => res.data.result.place.list);

    //반려동물 동반 가능한 장소 리스트
    const petFriendlyPlaceList:KakaoBotPetFriendlyResult[] = await pipe(
      naverSearchResultList,
      toAsync,
      map(async (place: { id: string })=>await axios(PLACE_INFO_URL(place.id)).then((res) => res.data)),
      concurrent(100),
      filter((place: NaverSearchResult)=>place.options.find((d: NaverOption) => d.id == NaverOptionId.DOGFRIENDLY)),
      map((dog_place: NaverSearchResult): KakaoBotPetFriendlyResult => {
        let buttons: KakaoBotButton[] = [{
          action: "webLink",
          label: "지도",
          webLinkUrl: NAVER_MAP_URL(param.query,dog_place.id),
        }];
        dog_place.urlList[0] && buttons.push({
          action: "webLink",
          label: "홈페이지",
          webLinkUrl: dog_place.urlList[0].url,
        });
        dog_place.phone && buttons.push({
          action: "phone",
          label: "전화",
          phoneNumber: dog_place.phone,
        });

        return {
          title: dog_place.name,
          description: dog_place.address,
          thumbnail: {
            imageUrl: dog_place.imageURL,
            link: {
              web: NAVER_MAP_URL(param.query,dog_place.id),
            },
          },
          buttons,
        };
      }),
      take(10),
      toArray
    );
    return petFriendlyPlaceList;
  } catch (e) {
    console.log(e);
    return null;
  }
};
