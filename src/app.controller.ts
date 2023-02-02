import { entries, fromEntries, map, pipe, reject, toArray } from '@fxts/core';
import { Controller, Get,Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root(){
    return {message:'DogCourse'};
  }

  @Get('map')
  map(@Res() res: Response){
    const query = res.req.query;
    const position = pipe(
      [...entries(query)],
      reject(p=>p['center']),
      map(([key,value]:[string,string])=>
        [key,[parseFloat(value.split(',')[0]),parseFloat(value.split(',')[1])]] as [string, [number, number]]),
      fromEntries
    )
    return res.render(
      'map',
      {
        clientId:process.env.NAVER_CLIENT_ID,
        lat:(query.center as string).split(';')[1],
        lng:(query.center as string).split(';')[0],
        position:JSON.stringify(position)
      },
    );
  }
}
