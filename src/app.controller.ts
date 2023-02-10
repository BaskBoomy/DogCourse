import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { NaverMapData } from './type/naver/types';

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
    const {query} = res.req;
    let mapData:NaverMapData = null;
    if(query){
      mapData = this.appService.getMapData(res.req);
    }
    return res.render(
      'map',
      mapData
    );
  }
}
