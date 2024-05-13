import db from "../../config/connectDB";
import response from "../../utils/response";
import LOGGER from "../../utils/logger";

class ArtistServices {
  static async getMaterail(data) {
    try {
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      queryDb.where("bid_class", "!=", "w/d");
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }

      result = await queryDb
        .select("material_kind")
        .count("id", { as: "total_cnt" })
        .count("hammer_price", { as: "win_cnt" })
        .groupby("material_kind");
      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getTopHammerPrice(data) {
    try {
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }

      result = await queryDb
        .select(
          db.raw("concat_ws(' - ', title_kor, title_eng) as title"),
          "material_kind",
          "mfg_date",
          db.raw("concat_ws(' - ', height, width, depth) as title"),
          "company",
          db.raw("mid(transact_date, 1, 10) as title"),
          "hammer_price"
        )
        .orderby("hammer_price")
        .limit(10);

      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  // bidByMaterial
  // total_bid
  // top 10
  // priceByWinbid
  // lotByWinbid
  // lotByMaterial
  // resultByPeriod
  // lotByPeriod
  // bidByPeriod
  // medianByPeriod
  // distributionByPeriod
}
