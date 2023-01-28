import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleAPIService{
    private readonly logger = new Logger(GoogleAPIService.name);
    constructor(private httpService:HttpService){}
    
    async getXYCoordinate(place: string): Promise<string> {
        const {data} = await firstValueFrom(
            this.httpService
                .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${process.env.GOOGLE_SECRET_KEY}`)
                .pipe(
                    catchError((error:any)=>{
                        this.logger.error(error.response.data);
                        throw 'An error happened!';
                    })
                )
        );
        const location = data.results[0].geometry.location;
        return `${location.lng};${location.lat}`;
    }
} 