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
    return res.render(
      'map',
      this.appService.getMapData(res.req)
    );
  }
}
