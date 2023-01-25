import { Request, Response } from "express";
import { getPetFriendlyList } from "./service/pet_friendly_list";

const express = require("express");
const env = require("dotenv").config();
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();
app.use(logger("dev", {}));
app.use(bodyParser.json());
app.post("/search", async (req: Request, res: Response) => {
  const { type, address } = req.body.action.params;
  console.log(req.body);
  console.log(`type: ${type}, address: ${address}`);
  const petFriendlyPlaceList = await getPetFriendlyList(
    type as string,
    address as string
  );
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          carousel: {
            type: "basicCard",
            items: petFriendlyPlaceList,
          },
        },
      ],
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
