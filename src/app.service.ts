import { Injectable } from '@nestjs/common';
import { Request } from 'express';

type NaverMapData = {
  [p: string]: string | number;
};
@Injectable()
export class AppService {
  getMapData({ query }: Request): NaverMapData {
    try {
      if(Object.keys(query).length == 0 ){
        return {
          clientId: process.env.NAVER_CLIENT_ID,
          centerLat:'',
          centerLng:'',
          type:'',
          address:'',
        }
      }
      const {type,address,centerLat,centerLng} = query;
      return {
        clientId: process.env.NAVER_CLIENT_ID,
        centerLat:centerLat as string,
        centerLng:centerLng as string,
        type:type as string,
        address:address as string,
      };
    } catch (e) {
      throw e;
    }
  }
}
