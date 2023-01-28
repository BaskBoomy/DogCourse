import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { GOOGLE_GEO_URL } from 'src/API/api';

@Injectable()
export class GoogleAPIService{
    private readonly logger = new Logger(GoogleAPIService.name);
    constructor(private httpService:HttpService){}
    
    async getXYCoordinate(place: string): Promise<string> {
        const {data} = await firstValueFrom(
            this.httpService.get(GOOGLE_GEO_URL(place)).pipe(
                catchError((error:any)=>{
                    this.logger.error(error.response.data);
                    throw 'An error happened!';
                })
            )
        );
        console.log(process.env.GOOGLE_SECRET_KEY);
        console.log(data);
        const location = data.results[0].geometry.location;
        return `${location.lng};${location.lat}`;
    }
} 