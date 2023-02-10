import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { NaverMapData } from './type/naver/types';

@Injectable()
export class AppService {
  getMapData({ query }: Request): NaverMapData {
    try {
      if(Object.keys(query).length == 0 ){
        return {
          NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
          DOGCOURSE_URL: process.env.DOGCOURSE_URL,
          centerLat:'',
          centerLng:'',
          type:'',
          address:'',
        }
      }
      const {type,address,centerLat,centerLng} = query;
      return {
        DOGCOURSE_URL: process.env.DOGCOURSE_URL,
        NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
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
