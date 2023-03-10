import { Injectable } from "@nestjs/common";
import { getRandomInt } from "src/helper/math";
import { KakaoResponseBody } from "src/type/kakao/types";

var cloudinary = require('cloudinary').v2;

cloudinary.config({
 cloud_name: process.env.CLOUDINARY_NAME,
 api_key: process.env.CLOUDINARY_KEY,
 api_secret: process.env.CLOUDINARY_SECRET,
 secure: true
});
@Injectable()
export class ReactionSerivce{
    constructor(){}
    async getReaction():Promise<KakaoResponseBody>{
      const tannyPictures = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'dogcourse' // add your folder
      });
      const randomPic = tannyPictures.resources[getRandomInt(1,tannyPictures.resources.length)].url;
      return {
        version:'2.0',
        template:{
            outputs:[
                {
                    simpleText:{
                        text:'π₯κ°μ¬ν©λλ€π₯'
                    }
                },
                {
                    simpleImage:{
                        imageUrl:randomPic,
                        altText:'μ΄λ―Έμ§κ° μ‘΄μ¬νμ§ μμ΅λλ€!'
                    }
                },
            ]
        }
      }
    }
}