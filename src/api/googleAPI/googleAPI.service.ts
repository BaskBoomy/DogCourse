import { HttpService } from '@nestjs/axios/dist';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { GOOGLE_GEO_URL } from 'src/helper/url';

@Injectable()
export class GoogleAPIService{
    private readonly logger = new Logger(GoogleAPIService.name);
    constructor(private httpService:HttpService){}
    
    async getXYCoordinate(place: string): Promise<string> {
        try{
            const {data} = await firstValueFrom(
                this.httpService.get(GOOGLE_GEO_URL(place)).pipe(
                    catchError((error:any)=>{
                        this.logger.error(error.response.data);
                        throw 'An error happened!';
                    })
                )
            );
            if(data.error_message){
                throw data;
            }
            const location = data.results[0].geometry.location;
            return `${location.lng};${location.lat}`;
        }catch(e){
            throw e;
        }
    }
} 