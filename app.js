import express from "express";
import * as path from "path";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import LOGGER from "./server/utils/logger";

import authRouter from "./server/api/auth";
import searchRouter from "./server/api/search";
import rankRouter from "./server/api/rank";
import annualRouter from "./server/api/annual";
import artistRouter from "./server/api/artist";
// import artmarketRouter from "./server/api/artmarket";
import servicesRouter from "./server/api/Hankyung";

const app = express();
require("dotenv").config();
const session = require("express-session");

app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());
app.use(helmet());

// logger
app.use((req, res, next) => {
  LOGGER.HTTP.request(req);
  next();
});

// Route
app.use(`/auth`, authRouter);
app.use("/crawling/search", searchRouter);
app.use("/crawling/rank", rankRouter);
app.use("/crawling/annual", annualRouter);
app.use("/crawling/artist", artistRouter);
// app.use("/crawling/artmarket", artmarketRouter);
app.use(`/invoke-api`, servicesRouter);
// Handle unknown route
app.use((req, res) => {
  res.status(404).send({
    result: false,
    message: `${req.url} not found!`,
  });
});
app.listen(3000, "0.0.0.0", () => {
  console.log("the server is running");
});
