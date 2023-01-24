import { geocoding } from "../helper/geolocation";
import { getQueryString } from "../helper/query";
import { pipe, map, toArray, toAsync, filter, concurrent } from "@fxts/core";
import axios from "axios";

export const getPetFriendlyList = async (type: string, address: string) => {
  try {
    const [coorX, coorY] = await geocoding(address as string);
    console.log(coorX, coorY);
    const param = {
      query: type,
      type: "all",
      searchCoord: `${coorX};${coorY}`,
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

    console.time();
    //반려동물 동반 가능한 장소 리스트
    const pet_friendly_place_list = await pipe(
      naver_search_result_list,
      toAsync,
      map(async (place: any) =>await axios(`https://map.naver.com/v5/api/sites/summary/${place.id}?lang=ko`)),
      map((place) => place.data),
      filter((place) => place.options.find((d: any) => d.id == 15)),
      map((dog_place) => {
        return {
          id: dog_place.id,
          name: dog_place.name,
          address: dog_place.address,
          // thumbnail : dog_place.imageURL,
          // images:[...dog_place.images.map((x:any)=>x.url)],
          url: `https://map.naver.com/v5/search/${param.query}/place/${dog_place.id}`,
        };
      }),
      concurrent(100),
      toArray
    );
    console.timeEnd();
    return pet_friendly_place_list;
  } catch (e) {
    console.log(e);
  }
};
