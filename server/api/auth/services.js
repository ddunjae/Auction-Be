import db from "../../config/connectDB";
import response from "../../utils/response";
import LOGGER from "../../utils/logger";
import { USER_ROLE } from "../../utils/strVar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AucthServices {
  // join
  static async signUp(data) {
    const trx = await db.transaction();
    try {
      const connection = trx("user");
      let { user_id, user_pw, user_name, user_role = USER_ROLE.USER } = data;
      if (!USER_ROLE[user_role]) {
        return response.ERROR(
          500,
          `User role:${user_role} not support`,
          "auh_003"
        );
      }
      const existingUser = await connection
        .clone()
        .where({ user_id: user_id.trim() })
        .first();
      if (existingUser) {
        return response.WARN(
          400,
          "The user name or email has already existed!",
          "auh_004"
        );
      }

      const hashedPassword = bcrypt.hashSync(user_pw, 8);
      const dataToBeInserted = {
        user_id: user_id.trim(),
        user_pw: hashedPassword,
        user_name: user_name,
        user_role: USER_ROLE[user_role],
      };
      const [id] = await connection.insert(dataToBeInserted, ["id"]);

      await trx.commit();
      return response.SUCCESS("Sign up successfully!");
    } catch (error) {
      await trx.rollback();
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    } finally {
      await trx.commit();
    }
  }
  // login
  static async signIn(data, ipIdentify) {
    try {
      const connection = db("user");
      const { user_id, user_pw } = data;
      const user = await connection.where({ user_id: user_id.trim() }).first();
      if (!user) {
        return response.WARN(404, "User not found!", "auh_404");
      }
      const isPasswordValid = bcrypt.compareSync(user_pw, user.user_pw);
      if (!isPasswordValid) {
        return response.WARN(400, "Invalid password!", "auh_006");
      }
      const dataToBeSigned = {
        id: user.id,
        user_id: user.user_id,
        user_role: user.user_role,
        user_name: user.user_name,
      };
      const accessToken = jwt.sign(
        dataToBeSigned,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRY_TIME,
        }
      );
      const dataToBeSent = {
        id: user.id,
        user_id: user.user_id,
        user_role: user.user_role,
        user_name: user.user_name,
        accessToken,
      };
      return response.SUCCESS("Sign in successfully!", dataToBeSent);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
}
export default AucthServices;
