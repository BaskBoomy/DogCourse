import { Controller, Get } from '@nestjs/common';
import { Render } from '@nestjs/common/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root(){
    return {message:'DogCourse'};
  }
}
