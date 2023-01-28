import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleAPIService } from './googleAPI.service';
@Module({
  imports: [HttpModule],
  providers: [GoogleAPIService],
  exports:[GoogleAPIService]
})
export class GoogleAPIModule {}
