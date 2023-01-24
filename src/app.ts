import { Request, Response } from "express";
import { getPetFriendlyList } from "./service/pet_friendly_list";

const express = require('express');
const env = require('dotenv').config();
const app = express();

app.get('/search', async function (req: Request, res: Response) {
  const {type, address} = req.query;
  const result = await getPetFriendlyList(type as string,address as string);
  res.json(result);
});

app.listen(3000, ()=> console.log('app listening on port 3000!'));