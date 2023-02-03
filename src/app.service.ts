import { entries, fromEntries, map, pipe, reject } from '@fxts/core';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

type NaverMapData = {
  [p: string]: string | number;
};
@Injectable()
export class AppService {
  getMapData({ query }: Request): NaverMapData {
    try {
      console.log(query);
      if(Object.keys(query).length == 0 ){
        return {
          clientId: process.env.NAVER_CLIENT_ID,
          lat:'37.53894081054399',
          lng:'127.05320190236814',
          position: JSON.stringify({}),
        }
      }
      const [lat, lng] = (Object.values(query)[0] as string||'').split(',');
      console.log(lat, lng);
      const position = pipe(
        [...entries(query)],
        map(
          ([key, value]: [string, string]) =>
            [key,[parseFloat(value.split(',')[0]),parseFloat(value.split(',')[1])]] as [string, [number, number]]
        ),
        fromEntries,
      );
      return {
        clientId: process.env.NAVER_CLIENT_ID,
        lat,
        lng,
        position: JSON.stringify(position),
      };
    } catch (e) {
      throw e;
    }
  }
}
