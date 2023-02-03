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
      const [lat, lng] = [
        (query.center as string).split(';')[1],
        (query.center as string).split(';')[0],
      ];
      console.log(query);
      const position = pipe(
        [...entries(query)],
        reject(([key,_]) => key=='center'),
        map(
          ([key, value]: [string, string]) =>
            [key,[parseFloat(value.split(',')[0]),parseFloat(value.split(',')[1])]] as [string, [number, number]],
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
