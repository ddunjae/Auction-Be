import commonResult from "../commonResult/services";
import express from "express";
import { filteringSchema } from "./schemas";
import { auth, validator } from "../../middlewares";

const getHammerRate = async (req, res) => {
  const data = req.body;
  const userRequest = req.user;
  console.log(userRequest);

  const response = await commonResult.getHammerRate(data);
  return res.send(response);
};
const getPriceSection = async (req, res) => {
  const data = req.body;
  const response = await commonResult.getPriceSection(data);
  data.kind = "entries";
  const response2 = await commonResult.getPriceSection(data);
  response.data.data = {
    hammer_price: response.data.data,
    entries: response2.data.data,
  };
  return res.status(response.code).send(response.data);
};
const getHammerSection = async (req, res) => {};
const router = express.Router();
router.post("/hammer_rate", auth, validator(filteringSchema), getHammerRate);
router.post(
  "/price_section",
  auth,
  validator(filteringSchema),
  getPriceSection
);
export default router;
