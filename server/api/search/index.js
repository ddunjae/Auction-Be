import searchServices from "./services";
import { filteringSchema } from "./schemas";
import express from "express";
import { auth, validator } from "../../middlewares";
import LOGGER from "../../utils/logger";
const getAllData = async (req, res) => {
  const data = req.body;
  const userRequest = req.user;
  console.log(userRequest);
  const response = await searchServices.getAllData(data);
  return res.send(response);
};

const router = express.Router();
router.post("/", auth, validator(filteringSchema), getAllData);
export default router;
