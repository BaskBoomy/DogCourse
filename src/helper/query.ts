import { pipe,entries,map,join } from "@fxts/core";
import { NaverSearchQueryParams, QueryParam } from "src/type/naver/types";

export const getQueryString = (param:QueryParam):string => pipe(
    param,
    entries,
    map(join('=')),
    join('&')
)