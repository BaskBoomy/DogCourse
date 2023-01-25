import { KakaoBotButton } from "./../type/kakao/types";
import { geocoding } from "../helper/geolocation";
import { getQueryString } from "../helper/query";
import {
  pipe,
  map,
  toArray,
  toAsync,
  filter,
  concurrent,
  take,
} from "@fxts/core";
import axios from "axios";
import { NaverSearchResult, NaverOption } from "type/naver/types";
import { KakaoBotPetFriendlyResult } from "type/kakao/types";

export const getPetFriendlyList = async (type: string, address: string) => {
  try {
    const searchCoord = await geocoding(address as string);
    console.log(searchCoord);
    const param = {
      query: type,
      type: "all",
      searchCoord,
      displayCount: 100,
      isPlaceRecommendationReplace: true,
      lang: "ko",
    };

    const naver_search_url = `https://map.naver.com/v5/api/search?${getQueryString(
      param
    )}`;

    //전체 검색 결과
    const naver_search_result_list = await axios(naver_search_url).then(
      (res: any) => res.data.result.place.list
    );

    //반려동물 동반 가능한 장소 리스트
    console.time();
    const pet_friendly_place_list = await pipe(
      naver_search_result_list,
      toAsync,
      map(
        async (place: { id: string }) =>
          await axios(
            `https://map.naver.com/v5/api/sites/summary/${place.id}?lang=ko`
          ).then((res) => res.data)
      ),
      concurrent(100),
      filter((place: NaverSearchResult) =>
        place.options.find((d: NaverOption) => d.id == 15)
      ),
      map((dog_place: NaverSearchResult): KakaoBotPetFriendlyResult => {
        let buttons: KakaoBotButton[] = [{
          action: "webLink",
          label: "지도",
          webLinkUrl: `https://map.naver.com/v5/search/${param.query}/place/${dog_place.id}`,
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
              web: `https://map.naver.com/v5/search/${param.query}/place/${dog_place.id}`,
            },
          },
          buttons,
        };
      }),
      take(10),
      toArray
    );
    console.timeEnd();
    return pet_friendly_place_list;
  } catch (e) {
    console.log(e);
  }
};
