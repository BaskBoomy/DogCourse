import { getQueryString } from "src/helper/query";
import { NaverSearchQueryParams } from "src/type/naver/types";

export const NAVER_SEARCH_URL = (params: NaverSearchQueryParams) =>`https://map.naver.com/v5/api/search?${getQueryString(params)}`;
export const PLACE_INFO_URL = (id: string) =>`https://map.naver.com/v5/api/sites/summary/${id}?lang=ko`;
export const NAVER_MAP_URL = (type: string, id: number | string) =>`https://map.naver.com/v5/search/${type}/place/${id}`;
export const GOOGLE_GEO_URL = (place:string) => `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${process.env.GOOGLE_SECRET_KEY}`;