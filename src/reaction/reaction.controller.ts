import { Body, Controller, Post } from '@nestjs/common';
import { KaKaoChatBotParam, KakaoResponseBody } from 'src/type/kakao/types';
import { ReactionSerivce } from './reaction.service';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionSerivce) {}

  @Post('getReaction')
  getDogFriendlyPlace(): Promise<KakaoResponseBody> {
    return this.reactionService.getReaction();
  }
}
