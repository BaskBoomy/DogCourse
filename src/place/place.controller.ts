import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlaceInfo } from 'src/dto/place/placeinfo';
import { KaKaoChatBotParam, KakaoResponseBody } from 'src/type/kakao/types';
import { NaverTrafficParams, NaverTrafficResult } from 'src/type/naver/types';
import { PlaceService } from './place.service';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('getDogFriendlyPlace')
  getDogFriendlyPlace(@Body() data:KaKaoChatBotParam): Promise<KakaoResponseBody> {
    console.log(data);
    return this.placeService.getDogFriendlyPlace(data);
  }

  @Post('getPlaceInfo')
  getPlaceInfo(@Body() data:any): Promise<KakaoResponseBody> {
    return this.placeService.getPlaceInfo(data);
  }

  @Post('getTrafficInfo')
  getTrafficInfo(@Body() data:NaverTrafficParams[]): Promise<NaverTrafficResult[]>{
    return this.placeService.getTrafficInfo(data);
  }
}
