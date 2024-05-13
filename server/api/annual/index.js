import AnnualResult from "./services";
import commonResult from "../commonResult/services";
import express from "express";
import LOGGER from "../../utils/logger";
const getYoy = async (req, res) => {
  const response = await AnnualResult.getYoY();
  return res.status(response.code).send(response.data);
};
const getTopArtist = async (req, res) => {
  const response = await AnnualResult.getTopArtist();
  return res.status(response.code).send(response.data);
};
const getTopLot = async (req, res) => {
  const response = await AnnualResult.getTopLot();
  return res.status(response.code).send(response.data);
};
const getTopComepetition = async (req, res) => {
  const response = await AnnualResult.getTopComepetition();
  return res.status(response.code).send(response.data);
};
const getTopOutperfomer = async (req, res) => {
  const response = await AnnualResult.getTopOutperfomer();
  return res.status(response.code).send(response.data);
};
const getRisingArtist = async (req, res) => {
  const response = await AnnualResult.getRisingArtist();
  return res.status(response.code).send(response.data);
};
const getPriceSection = async (req, res) => {
  const response = await commonResult.getPriceSection({ annual: true });
  return res.status(response.code).send(response.data);
};
const getHammerRate = async (req, res) => {
  const response = await commonResult.getHammerRate({ annual: true });
  return res.status(response.code).send(response.data);
};

const router = express.Router();
router.get("/yoy", getYoy);
router.get("/top_artist", getTopArtist);
router.get("/top_lot", getTopLot);
router.get("/top_competition", getTopComepetition);
router.get("/top_outperfomer", getTopOutperfomer);
router.get("/rising_artist", getRisingArtist);
router.get("/price_section", getPriceSection);
router.get("/hammer_rate", getHammerRate);
export default router;
