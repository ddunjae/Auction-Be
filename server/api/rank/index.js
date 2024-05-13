import RankService from "./services";
import { filteringSchema } from "./schemas";
import express from "express";
import { auth, validator } from "../../middlewares";
import LOGGER from "../../utils/logger";
const getRankData = async (req, res) => {
  const data = req.body;
  const userRequest = req.user;
  console.log(userRequest);
  const response = await RankService.getRank(data);
  return res.send(response);
};

const router = express.Router();
router.post("/", auth, validator(filteringSchema), getRankData);
export default router;
