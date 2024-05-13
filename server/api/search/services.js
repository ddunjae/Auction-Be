import response from "../../utils/response";
import LOGGER from "../../utils/logger";
import filterQuery from "../../utils/applyFilter_v1";
import db from "../../config/connectDB";

class SearchService {
  static async getAllData(data) {
    try {
      const page = data.page || 1;
      const list = data.list || 20;
      const order_column = data.order_column || "transact_date";
      const order = data.order || "desc";
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const dataList = await queryDb
        .select(
          "img",
          db.raw("concat_ws(' - ', artist_kor, artist_eng) as artist"),
          db.raw("concat_ws(' - ', title_kor, title_eng) as title"),
          "mfg_date",
          db.raw("concat_ws(' X ', height, width, depth) as size"),
          "material_kind",
          "hammer_price",
          "competition",
          "start_price",
          "estimate_min",
          "estimate_max",
          db.raw("mid(transact_date,1,10) as transact_date"),
          "company",
          "bid_class",
          // 밑의 select 요소는 v2에서 지워도 되는 내용
          "certification",
          db.raw("concat_ws(' - ', material_kor, material_eng) as material"),
          "signed",
          "company as source",
          "hammer_price as winning_bid",
          "start_price as start_bid",
          db.raw("on_off")
        )
        .orderBy(order_column, order)
        .offset((page - 1) * list)
        .limit(list);
      let no = (page - 1) * list + 1;
      for (let i of dataList) {
        i.no = no;
        no += 1;
      }
      return response.PAGEABLE(dataList, totalResult.count, page, list);
    } catch (error) {
      LOGGER.APP.error(error.stack);
      return response.ERROR(500, error.message, "sv_500");
    }
  }
}
export default SearchService;
