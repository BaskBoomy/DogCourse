import { pipe, map, entries, join, toArray,toAsync,filter,concurrent,each,reject} from "@fxts/core";
import { Request, Response } from "express";
import { geocoding } from "./helper/geolocation";
import { getQueryString } from "./helper/query";

const express = require('express');
const axios = require('axios').default;
const env = require('dotenv').config();
const app = express();
// 서울
// 37.413294 ~ 37.715133
// 126.269311 ~ 127.734086
app.get('/search', async function (req: Request, res: Response) {
  const {type, address} = req.query;
  const [coorX, coorY] = await geocoding(address as string);
  console.log(coorX, coorY);
  const param = {
    query: type,
    type: 'all',
    searchCoord: `${coorX};${coorY}`,
    displayCount: 100,
    isPlaceRecommendationReplace: true,
    lang: 'ko'
  }
  
  const naver_search_url = `https://map.naver.com/v5/api/search?${getQueryString(param)}`;

  //전체 검색 결과
  const naver_search_result_list = await axios(naver_search_url).then((res:any)=>res.data.result.place.list);

  console.time();
  //반려동물 동반 가능한 장소 리스트
  const pet_friendly_place_list = await pipe(
    naver_search_result_list,
    toAsync,
    map(async (place:any)=>await axios(`https://map.naver.com/v5/api/sites/summary/${place.id}?lang=ko`)),
    map((place)=>place.data),
    filter(place=>place.options.find((d:any)=>d.id==15)),
    map((dog_place)=>{
      return {
        id:dog_place.id,
        name:dog_place.name,
        address:dog_place.address,
        // thumbnail : dog_place.imageURL,
        // images:[...dog_place.images.map((x:any)=>x.url)],
        // url:`https://map.naver.com/v5/search/${param.query}/place/${dog_place.id}`
      }
    }),
    concurrent(100),
    toArray
  )
  console.timeEnd();

  res.json(pet_friendly_place_list);
});
app.listen(3000, function () {
  console.log('app listening on port 3000!');
});