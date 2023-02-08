import { HttpModule } from '@nestjs/axios';
import { PlaceService } from './place.service';
import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { GoogleAPIModule } from 'src/api/googleAPI/googleAPI.module';
import { GoogleAPIService } from 'src/api/googleAPI/googleAPI.service';
import { NaverAPIModule } from 'src/api/naverAPI/naverAPI.module';

@Module({
    imports:[HttpModule,NaverAPIModule],
    controllers:[PlaceController],
    providers:[PlaceService],
})
export class PlaceModule {}
