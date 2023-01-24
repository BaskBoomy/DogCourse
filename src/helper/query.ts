import { pipe,entries,map,join } from "@fxts/core";

export const getQueryString = (param:any) => pipe(
    param,
    entries,
    map(join('=')),
    join('&')
)