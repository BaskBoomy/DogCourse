import { HttpService } from '@nestjs/axios/dist';
import { HttpModule } from '@nestjs/axios';
import { PlaceService } from './place.service';
import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { GoogleAPIModule } from 'src/googleAPI/googleAPI.module';
import { GoogleAPIService } from 'src/googleAPI/googleAPI.service';

@Module({
    imports:[HttpModule,GoogleAPIModule],
    controllers:[PlaceController],
    providers:[PlaceService],
})
export class PlaceModule {}
