import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { GoogleAPIModule } from "../googleAPI/googleAPI.module";
import { NaverAPIService } from "./naverAPI.service";

@Module({
    imports:[HttpModule,GoogleAPIModule],
    providers:[NaverAPIService],
    exports:[NaverAPIService]
})
export class NaverAPIModule{}