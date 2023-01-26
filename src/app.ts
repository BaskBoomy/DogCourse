import { quickReplies, textResponse } from "./type/kakao/response_datas";
import { Request, Response } from "express";
import { getPetFriendlyList } from "./service/pet_friendly_list";

const express = require("express");
const env = require("dotenv").config();
const logger = require("morgan");
const bodyParser = require("body-parser");
require("console-stamp")(console, 'yyyy/mm/dd HH:MM:ss'); 

const app = express();
app.use(logger("dev", {}));
app.use(bodyParser.json());
app.post("/search", async (req: Request, res: Response) => {
  const { type, address } = req.body.action.params;
  console.log('userInfo',req.body.userRequest.user);
  console.log('searchKeyWord',`type: ${type}, address: ${address}`);

  const petFriendlyPlaceList = await getPetFriendlyList(
    type as string,
    address as string
  );

  const responseBody = {
    version: "2.0",
    template: petFriendlyPlaceList
      ? {
          outputs: [
            { carousel: { type: "basicCard", items: petFriendlyPlaceList } },
          ],
        }
      : {
          outputs: [
            {
              simpleText: {
                text: textResponse.NOPLACE,
              },
            },
          ],
          quickReplies:quickReplies.DEFAULT,
        },
  };
  res.status(200).send(responseBody);
});

app.post("/sayHello", (req: Request, res: Response) => {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "hello I'm Ryan",
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});
app.listen(3000, () => console.log("app listening on port 3000!"));
