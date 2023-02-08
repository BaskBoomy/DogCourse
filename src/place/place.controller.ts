import { Body, Controller, Post } from '@nestjs/common';
import { KaKaoChatBotParam, KakaoResponseBody } from 'src/type/kakao/types';
import { NaverMapResult, NaverSearchParam } from 'src/type/naver/types';
import { PlaceService } from './place.service';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('getDogFriendlyPlace')
  getDogFriendlyPlace(@Body() data:KaKaoChatBotParam): Promise<KakaoResponseBody> {
    return this.placeService.getDogFriendlyPlace(data);
  }

  @Post('getPlaceInfo')
  getPlaceInfo(@Body() data:any): Promise<KakaoResponseBody> {
    return this.placeService.getPlaceInfo(data);
  }

  @Post('getTrafficInfo')
  getTrafficInfo(@Body() data:NaverSearchParam): Promise<NaverMapResult[]>{
    return this.placeService.getTrafficInfo(data);
  }
}
