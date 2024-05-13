import AuthServices from "./services";
import { signUpSchema, signInSchema } from "./schemas";
const { removeJwt } = require("../../utils/jwtHandle");
import { auth, validator } from "../../middlewares";
import express from "express";
const signUpHandler = async (req, res) => {
  const data = req.body;
  const response = await AuthServices.signUp(data);
  return res.status(response.code).send(response.data);
};

const signInHandler = async (req, res) => {
  const data = req.body;
  const ipIdentify = req.ipIdentify;
  const response = await AuthServices.signIn(data, ipIdentify);

  return res.status(response.code).send(response.data);
};
const logoutHandler = async (req, res) => {
  removeJwt(req.jwtToken);
  return res
    .status(200)
    .send({ result: true, message: "Logout success", data: null });
};

const router = express.Router();
router.post("/sign-up", validator(signUpSchema), signUpHandler);
router.post("/sign-in", validator(signInSchema), signInHandler);
router.post("/logout", auth, logoutHandler);
export default router;
