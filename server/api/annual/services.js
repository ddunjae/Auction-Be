import db from "../../config/connectDB";
import response from "../../utils/response";
import LOGGER from "../../utils/logger";
const { provideDate } = require("../../utils/dateCalculation");

class AnnualResult {
  static async getYoY() {
    try {
      const { current_start, current_end, previous_start, previous_end } =
        provideDate();
      const connection = db("crawling");
      const queryDb = connection
        .whereBetween("transact_date", [previous_start, current_end])
        .where("bid_class", "!=", "w/d");
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb.select(
        db.raw(
          `sum(if(transact_date between '${previous_start}' and '${previous_end}', hammer_price,0)) as previous_price`
        ),
        db.raw(
          `sum(if(transact_date between '${current_start}' and '${current_end}', hammer_price,0)) as current_price`
        )
      );
      result[0].yoy =
        ((result[0].current_price - result[0].previous_price) /
          result[0].previous_price) *
        100;
      result[0].current_start = current_start;
      result[0].current_end = current_end;
      result[0].previous_start = previous_start;
      result[0].previous_end = previous_end;

      return response.SUCCESS("successfully!", result[0]);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }

  static async getTopLot() {
    try {
      const { current_start, current_end } = provideDate();
      const connection = db("crawling");
      const queryDb = connection
        .whereBetween("transact_date", [current_start, current_end])
        .where("bid_class", "!=", "w/d");
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb
        .select(
          db.raw("concat_ws('-', artist_kor, artist_eng) as artist"),
          db.raw("concat_ws('-', title_kor, title_eng) as title"),
          "img",
          "mfg_date",
          "hammer_price",
          "company",
          db.raw("mid(transact_date, 1, 10) as transact_date")
        )
        .orderBy("hammer_price", "desc")
        .first();
      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getTopArtist() {
    try {
      const { current_start, current_end, previous_start, previous_end } =
        provideDate();
      const connection = db("crawling");
      const queryDb = connection
        .whereBetween("transact_date", [previous_start, current_end])
        .where("bid_class", "!=", "w/d")
        .whereNotNull(db.raw("concat_ws('-', artist_kor, artist_eng)"))
        .groupBy(db.raw("concat_ws('-', artist_kor, artist_eng)"));
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb
        .clone()
        .select(
          db.raw("concat_ws('-', artist_kor, artist_eng) as artist"),
          "artist_birth",
          "artist_death",
          "img"
        )
        .count("id as entries")
        .sum("hammer_price as hammer_price")
        .count("hammer_price as winning_bid")
        .max("competition as max_competition")
        .where("transact_date", ">=", current_start)
        .orderBy(db.raw("sum(hammer_price)"), "desc")
        .first();
      const temp = await queryDb
        .sum("hammer_price as hammer_price")
        .where("transact_date", "<=", previous_end)
        .where(
          db.raw("concat_ws('-', artist_kor, artist_eng)"),
          "=",
          result.artist
        )
        .first();
      result.artist_date = !result.artist_birth
        ? null
        : !result.artist_death
        ? `b.${result.artist_birth}`
        : `${result.artist_birth} - ${result.artist_death}`;
      delete result.artist_birth;
      delete result.artist_death;
      if (temp) {
        result.yoy = temp.hammer_price
          ? (result.hammer_price - temp.hammer_price) / temp.hammer_price
          : null;
      } else {
        result.yoy = null;
      }
      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getTopComepetition() {
    try {
      const { current_start, current_end } = provideDate();
      const connection = db("crawling");
      const queryDb = connection
        .whereBetween("transact_date", [current_start, current_end])
        .where("bid_class", "!=", "w/d");
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb
        .select(
          db.raw("concat_ws('-', artist_kor, artist_eng) as artist"),
          db.raw("concat_ws('-', title_kor, title_eng) as title"),
          "hammer_price",
          "competition",
          "img",
          db.raw("mid(transact_date, 1, 10) as transact_date")
        )
        .orderBy("competition", "desc")
        .first();
      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getTopOutperfomer() {
    try {
      const { current_start, current_end, previous_start, previous_end } =
        provideDate();
      const connection = db("crawling");
      const queryDb = connection
        .whereBetween("transact_date", [previous_start, current_end])
        .where("bid_class", "!=", "w/d")
        .whereNotNull(db.raw("concat_ws('-', artist_kor, artist_eng)"))
        .groupBy(db.raw("concat_ws('-', artist_kor, artist_eng)"));
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb
        .select(
          db.raw("concat_ws('-', artist_kor, artist_eng) as artist"),
          "artist_birth",
          "artist_death",
          "img",
          db.raw(
            `avg(if(transact_date between '${current_start}' and '${current_end}', hammer_price, null))
            /avg(if(transact_date between '${previous_start}' and '${previous_end}', hammer_price, null))*100 as hammer_price_changerate`
          ),
          db.raw(
            `sum(if(transact_date between '${current_start}' and '${current_end}', hammer_price, null)) as current_hammer_price`
          ),
          db.raw(
            `sum(if(transact_date between '${previous_start}' and '${previous_end}', hammer_price, null)) as previous_hammer_price`
          )
        )
        .orderBy("hammer_price_changerate", "desc")
        .first();
      result.artist_date = !result.artist_birth
        ? null
        : !result.artist_death
        ? `b.${result.artist_birth}`
        : `${result.artist_birth} - ${result.artist_death}`;
      delete result.artist_birth;
      delete result.artist_death;
      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getRisingArtist() {
    try {
      const { current_start, current_end, previous_start, previous_end } =
        provideDate();
      const connection = db("crawling");
      const queryDb = connection
        .whereBetween("transact_date", [previous_start, current_end])
        .where("bid_class", "!=", "w/d")
        .whereNotNull(db.raw("concat_ws('-', artist_kor, artist_eng)"))
        .groupBy(db.raw("concat_ws('-', artist_kor, artist_eng)"));
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb
        .select(
          db.raw("concat_ws('-', artist_kor, artist_eng) as artist"),
          "artist_birth",
          "artist_death",
          "img",
          db.raw(
            `avg(if(transact_date between '${current_start}' and '${current_end}', (estimate_min+estimate_max), null))
            /avg(if(transact_date between '${previous_start}' and '${previous_end}', (estimate_min+estimate_max), null))*100 as estimate_changerate`
          ),
          db.raw(
            `sum(if(transact_date between '${current_start}' and '${current_end}', hammer_price, null)) as current_hammer_price`
          ),
          db.raw(
            `sum(if(transact_date between '${previous_start}' and '${previous_end}', hammer_price, null)) as previous_hammer_price`
          )
        )
        .orderBy("estimate_changerate", "desc")
        .first();
      result.artist_date = !result.artist_birth
        ? null
        : !result.artist_death
        ? `b.${result.artist_birth}`
        : `${result.artist_birth} - ${result.artist_death}`;
      delete result.artist_birth;
      delete result.artist_death;
      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
}

export default AnnualResult;
