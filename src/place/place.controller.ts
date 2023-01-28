import { Body, Controller, Post } from '@nestjs/common';
import { PlaceInfo } from 'src/dto/place/placeinfo';
import { KakaoResponseBody } from 'src/type/kakao/types';
import { PlaceService } from './place.service';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post('getDogFriendlyPlace')
  getDogFriendlyPlace(@Body() data): Promise<KakaoResponseBody> {
    return this.placeService.getDogFriendlyPlace(data);
  }
}
