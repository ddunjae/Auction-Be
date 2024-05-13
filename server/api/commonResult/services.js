import db from "../../config/connectDB";
import response from "../../utils/response";
import LOGGER from "../../utils/logger";
import filterQuery from "../../utils/applyFilter_v1";
const { provideDate } = require("../../utils/dateCalculation");

class commonResult {
  static async getPriceSection(data) {
    try {
      let { kind = "hammer_price", annual = false } = data;
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      queryDb.where("bid_class", "!=", "w/d");
      if (annual) {
        const { current_start, current_end } = provideDate();
        queryDb.whereBetween("transact_date", [current_start, current_end]);
      }

      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      if (kind != "hammer_price") {
        kind = 1;
      }
      let sub_query =
        `sum(case when hammer_price >= 10000000 and hammer_price < 100000000  then ${kind} else 0 end) as below100m, ` +
        `sum(case when hammer_price >= 100000000 and hammer_price < 500000000 then ${kind} else 0 end) as below500m`;
      if (!annual) {
        sub_query =
          `sum(case when hammer_price >= 10000000 and hammer_price < 50000000  then ${kind} else 0 end) as below50m, ` +
          `sum(case when hammer_price >= 50000000 and hammer_price < 100000000  then ${kind} else 0 end) as below100m, ` +
          `sum(case when hammer_price >= 100000000 and hammer_price < 300000000 then ${kind} else 0 end) as below300m, ` +
          `sum(case when hammer_price >= 300000000 and hammer_price < 500000000 then ${kind} else 0 end) as below500m`;
      }
      const result = await queryDb
        .select(
          db.raw(
            `sum(case when hammer_price < 1000000 then ${kind} else 0 end) as below1m`
          ),
          db.raw(
            `sum(case when hammer_price >= 1000000 and hammer_price < 10000000 then ${kind} else 0 end) as below10m`
          ),
          db.raw(sub_query),
          db.raw(
            `sum(case when hammer_price >= 500000000 then ${kind} else 0 end) as above500m`
          )
        )
        .first();
      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getHammerRate(data) {
    try {
      let { kind = "hammer_price", annual = false } = data;
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      queryDb.where("bid_class", "!=", "w/d");
      if (annual) {
        const { current_start, current_end } = provideDate();
        queryDb.whereBetween("transact_date", [current_start, current_end]);
      }
      console.log(queryDb.clone().toString());
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const temp = await queryDb
        .select("bid_class")
        .count("id as count")
        .groupBy("bid_class");
      let result = {};
      for (let i of temp) {
        result[
          `${i.bid_class == null ? "not_sold" : i.bid_class.toLowerCase()}`
        ] = i.count;
        result[
          `${i.bid_class == null ? "not_sold" : i.bid_class.toLowerCase()}_rate`
        ] = (i.count / totalResult.count) * 100;
      }
      result.winning_bid = totalResult.count - result.not_sold;
      result.hammer_rate = (result.winning_bid / totalResult.count) * 100;

      if (annual) {
        result = {
          entries: totalResult.count,
          winning_bid: result.winning_bid,
          hammer_rate: result.hammer_rate,
        };
      }
      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getLotByPeriod(data) {
    try {
      let { period = "yearly" } = data;
      if (period == "yearly") {
        date = "date_format(transact_date, '%Y')";
      }
      if (period == "half") {
        date =
          "concat(DATE_FORMAT(transact_date,'%Y '),if(QUARTER(transact_date) in (1,2),'상반기','하반기'))";
      }
      if (period == "quater") {
        date =
          "concat(DATE_FORMAT(transact_date,'%Y '),concat(QUARTER(transact_date),'분기'))";
      }
      if (period == "monthly") {
        date = "DATE_FORMAT(transact_date,'%Y-%m')";
      }
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      queryDb.where("bid_class", "!=", "w/d");
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb
        .select(db.query(`${date} as date`))
        .count("hammer_price as winning_bid")
        .count("id as entries")
        .sum("hammer_price as hammer_price")
        .groupBy("date")
        .orderBy("transact_date");

      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getResultByPeriod(data) {
    try {
      let { period = "yearly" } = data;
      if (period == "yearly") {
        date = "date_format(transact_date, '%Y')";
      }
      if (period == "half") {
        date =
          "concat(DATE_FORMAT(transact_date,'%Y '),if(QUARTER(transact_date) in (1,2),'상반기','하반기'))";
      }
      if (period == "quater") {
        date =
          "concat(DATE_FORMAT(transact_date,'%Y '),concat(QUARTER(transact_date),'분기'))";
      }
      if (period == "monthly") {
        date = "DATE_FORMAT(transact_date,'%Y-%m')";
      }
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      queryDb.where("bid_class", "!=", "w/d");
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb
        .select(
          db.query(`${date} as date`),
          db.raw("sum(if(bid_class = 'ABOVE', 1, 0)) as above"),
          db.raw("sum(if(bid_class = 'WITHIN', 1, 0)) as within"),
          db.raw("sum(if(bid_class = 'BELOW', 1, 0)) as below"),
          db.raw("sum(if(bid_class is null, 1, 0)) as notsold")
        )
        .groupBy("date")
        .orderBy("transact_date");

      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
  static async getMedianByPeriod(data) {
    try {
      let { period = "yearly" } = data;
      if (period == "yearly") {
        date = "date_format(transact_date, '%Y')";
      }
      if (period == "half") {
        date =
          "concat(DATE_FORMAT(transact_date,'%Y '),if(QUARTER(transact_date) in (1,2),'상반기','하반기'))";
      }
      if (period == "quater") {
        date =
          "concat(DATE_FORMAT(transact_date,'%Y '),concat(QUARTER(transact_date),'분기'))";
      }
      if (period == "monthly") {
        date = "DATE_FORMAT(transact_date,'%Y-%m')";
      }
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      queryDb.where("bid_class", "!=", "w/d");
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const result = await queryDb
        .select(
          db.query(`${date} as date`),
          db.raw("sum(if(bid_class = 'ABOVE', 1, 0)) as above"),
          db.raw("sum(if(bid_class = 'WITHIN', 1, 0)) as within"),
          db.raw("sum(if(bid_class = 'BELOW', 1, 0)) as below"),
          db.raw("sum(if(bid_class is null, 1, 0)) as notsold")
        )
        .groupBy("date")
        .orderBy("transact_date");

      return response.SUCCESS("successfully!", result);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
}
export default commonResult;
