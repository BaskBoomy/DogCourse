import { pipe,entries,map,join } from "@fxts/core";
import { QueryParam } from "src/type/naver/types";

export const getQueryString = (param:QueryParam):string => pipe(
    param,
    entries,
    map((([k,v]:[string,string])=>{
        k=k.replace('&',',');
        return `${k}=${v}`;
    })),
    join('&')
)