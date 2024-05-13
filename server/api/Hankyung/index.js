import SolutionServices from "./services";
import { ipAuth, validator } from "../../middlewares";
import express from "express";
import { optionRankSchema, optionSectionSchema } from "./schemas";

const yoyHandler = async (req, res) => {
  const response = await SolutionServices.getYoY();
  return res.status(response.code).send(response.data);
};
const hammerRateHandler = async (req, res) => {
  const response = await SolutionServices.getHammerRate();
  return res.status(response.code).send(response.data);
};
const monthlyHandler = async (req, res) => {
  const response = await SolutionServices.getMonthlyResult();
  return res.status(response.code).send(response.data);
};
const topLotHandler = async (req, res) => {
  const response = await SolutionServices.getTopLot();
  return res.status(response.code).send(response.data);
};
const topArtistHandler = async (req, res) => {
  const response = await SolutionServices.getTopArtist();
  return res.status(response.code).send(response.data);
};
const rankHandler = async (req, res) => {
  const data = req.query;
  const response = await SolutionServices.getRank(data);
  return res.status(response.code).send(response.data);
};
const resultCategoryHandler = async (req, res) => {
  const response = await SolutionServices.getResultCategory();
  return res.status(response.code).send(response.data);
};
const priceSectionHandler = async (req, res) => {
  const data = req.query;
  const response = await SolutionServices.getPriceSection(data);
  return res.status(response.code).send(response.data);
};
const onoffSectionHandler = async (req, res) => {
  const data = req.query;
  const response = await SolutionServices.getOnOffSection(data);
  return res.status(response.code).send(response.data);
};
const occupyAuctionHandler = async (req, res) => {
  const response = await SolutionServices.getOccupyAuction();
  return res.status(response.code).send(response.data);
};

const router = express.Router();
router.get("/yoy", ipAuth, yoyHandler);
router.get("/hammer_rate", ipAuth, hammerRateHandler);
router.get("/monthly_results", ipAuth, monthlyHandler);
router.get("/top_lot", ipAuth, topLotHandler);
router.get("/top_artist", ipAuth, topArtistHandler);
router.get("/rank", ipAuth, validator(optionRankSchema), rankHandler);
router.get("/category_result", ipAuth, resultCategoryHandler);
router.get(
  "/price_section",
  ipAuth,
  validator(optionSectionSchema),
  priceSectionHandler
);
router.get(
  "/onoff_section",
  ipAuth,
  validator(optionSectionSchema),
  onoffSectionHandler
);
router.get("/occupy_auction", ipAuth, occupyAuctionHandler);

export default router;
