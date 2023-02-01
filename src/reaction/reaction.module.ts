import { Module } from "@nestjs/common";
import { ReactionController } from "./reaction.controller";
import { ReactionSerivce } from "./reaction.service";


@Module({
    imports:[],
    controllers:[ReactionController],
    providers:[ReactionSerivce],
})
export class ReactionModule{}