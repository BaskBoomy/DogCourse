import { pipe,entries,map,join } from "@fxts/core";
import { NaverSearchQueryParams } from "src/type/naver/types";

export const getQueryString = (param:NaverSearchQueryParams):string => pipe(
    param,
    entries,
    map(join('=')),
    join('&')
)