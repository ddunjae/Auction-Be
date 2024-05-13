import response from "../../utils/response";
import LOGGER from "../../utils/logger";
import filterQuery from "../../utils/applyFilter_v1";
// import filterQuery from "../../utils/applyFilter";
import db from "../../config/connectDB";

class RankService {
  static async getRank(data) {
    try {
      let { kind = "hammer_price", page = 1, list = 20 } = data;
      const connection = db("crawling");
      const queryDb = filterQuery(connection, data);
      queryDb
        .whereNotNull(db.raw("concat('-',artist_kor,artist_eng)"))
        .groupBy(db.raw("concat('-',artist_kor,artist_eng)"));
      const totalResult = await queryDb.clone().count("id as count").first();
      if (totalResult.count === 0) {
        return response.WARN(404, "data not found!", "404");
      }
      const dataList = await queryDb
        .select(
          db.raw("concat_ws(' - ',artist_kor,artist_eng) as artist"),
          db.raw("count(hammer_price)/count(id)*100 as hammer_rate"),
          // 밑의 select 요소는 v2에서 지워도 되는 내용
          db.raw("count(hammer_price)/count(id)*100 as winbid_rate"),
          db.raw("count(id) as total_lot"),
          db.raw("sum(hammer_price) as total_winbid")
        )
        .count("id as entries")
        .sum("hammer_price as hammer_price")
        .max("hammer_price as max_price")
        .orderBy(kind, "desc")
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
export default RankService;
