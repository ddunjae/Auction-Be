import db from "../config/connectDB";

function applyFilter(connection, data) {
  // const hammer_price = "winning_bid";
  // const withdraw = "cancel";
  const hammer_price = "hammer_price";
  const withdraw = "withdraw";
  let {
    from,
    to,
    date = "-",
    success,
    bid_class,
    pricetp = hammer_price,
    price = "-",
    title_search,
    material,
    material_search,
    mfgDate = "-",
    height = "-",
    width = "-",
    auc,
    location,
    on_off,
    certification,
    artist_search,
  } = data;
  const date_from = date.split("-")[0] != "" ? date.split("-")[0] : from;
  const date_to = date.split("-")[1] != "" ? date.split("-")[1] : to;
  success = success
    ? ["111", "000"].includes(success)
      ? undefined
      : success
    : undefined;
  bid_class = bid_class
    ? ["111", "000"].includes(bid_class)
      ? undefined
      : bid_class
    : undefined;
  material = typeof material == "string" ? [material] : material;
  auc = typeof auc == "string" ? [auc] : auc;
  location = typeof location == "string" ? [location] : location;

  const queryDb = connection.where(
    "transact_date",
    // db.raw(
    //   `str_to_date(concat_ws('-',transact_y, transact_m, transact_d), "%Y-%m-%d")`
    // ),
    "<=",
    db.raw("curdate()")
  );

  if (date_from) {
    queryDb.where(
      "transact_date",
      // db.raw(
      //   `str_to_date(concat_ws('-',transact_y, transact_m, transact_d), "%Y-%m-%d")`
      // ),
      ">=",
      db.raw(`str_to_date(${date_from}, "%Y%m%d")`)
    );
  }
  if (date_to) {
    queryDb.where(
      "transact_date",
      // db.raw(
      //   `str_to_date(concat_ws('-',transact_y, transact_m, transact_d), "%Y-%m-%d")`
      // ),
      "<=",
      db.raw(`str_to_date(${date_to}, "%Y%m%d")`)
    );
  }
  if (auc) {
    queryDb.whereIn("company", auc);
  }
  if (location) {
    queryDb.whereIn("location", location);
  }
  if (material) {
    queryDb.where(function () {
      if (material_search) {
        this.whereIn("material_kind", material)
          .orWhere("material_kor", "like", `%${material_search}%`)
          .orWhere("material_eng", "like", `%${material_search}%`);
      } else {
        this.whereIn("material_kind", material);
      }
    });
  } else if (material_search) {
    queryDb.where(function () {
      this.orWhere("material_kor", "like", `%${material_search}%`).orWhere(
        "material_eng",
        "like",
        `%${material_search}%`
      );
    });
  }
  if (on_off) {
    queryDb.where("on_off", "=", on_off);
  }
  if (title_search) {
    queryDb.where(function () {
      this.orWhere("title_kor", "like", `%${title_search}%`).orWhere(
        "title_eng",
        "like",
        `%${title_search}%`
      );
    });
  }
  if (artist_search) {
    queryDb.where(function () {
      this.orWhere("artist_kor", "like", `%${artist_search}%`).orWhere(
        "artist_eng",
        "like",
        `%${artist_search}%`
      );
    });
  }
  if (height.split("-")[0]) {
    queryDb.where("height", ">=", height.split("-")[0].replace("%2E", "."));
  }
  if (height.split("-")[1]) {
    queryDb.where("height", "<=", height.split("-")[1].replace("%2E", "."));
  }
  if (width.split("-")[0]) {
    queryDb.where("width", ">=", width.split("-")[0].replace("%2E", "."));
  }
  if (width.split("-")[1]) {
    queryDb.where("width", "<=", width.split("-")[1].replace("%2E", "."));
  }
  if (price.split("-")[0]) {
    queryDb.where(`${pricetp}`, ">=", price.split("-")[0]);
  }
  if (price.split("-")[1]) {
    queryDb.where(`${pricetp}`, "<=", price.split("-")[1]);
  }
  if (mfgDate.split("-")[0]) {
    queryDb.where(db.raw("mid(mfg_date,1,4)"), ">=", mfgDate.split("-")[0]);
  }
  if (mfgDate.split("-")[1]) {
    queryDb.where(db.raw("mid(mfg_date,1,4)"), "<=", mfgDate.split("-")[1]);
  }
  if (certification != undefined) {
    if (certi) {
      queryDb.whereNotNull("certification");
    } else {
      queryDb.whereNull("certification");
    }
  }
  if (on_off == 1) {
    queryDb.where("on_off", "=", "online");
  }
  if (on_off == 0) {
    queryDb.where("on_off", "=", "offline");
  }
  if (success) {
    queryDb.where(function () {
      if (success[0] == "1") {
        this.orWhereNotNull(hammer_price);
      }
      if (success[1] == "1") {
        this.orWhere(
          this.whereNull(hammer_price).orWhere("bid_class", "!=", "w/d")
        );
      }
      if (success[2] == "1") {
        this.orWhere("bid_class", "=", "w/d");
      }
    });
  }
  if (bid_class) {
    queryDb.where(function () {
      if (bid_class[0] == "1") {
        this.orWhere(hammer_price, "<", db.raw("estimate_min"));
      }
      if (bid_class[1] == "1") {
        this.orWhereNotNull(hammer_price)
          .where(function () {
            this.where(function () {
              this.whereNull("estimate_min").whereNull("estimate_max");
            }).orWhere(function () {
              this.whereNot(hammer_price, "<", db.raw("estimate_min")).whereNot(
                hammer_price,
                ">",
                db.raw("estimate_max")
              );
            });
          })
          .orWhereBetween(hammer_price, [
            db.raw("estimate_min"),
            db.raw("estimate_max"),
          ]);
      }
      if (bid_class[2] == "1") {
        this.orWhere(hammer_price, ">", db.raw("estimate_max"));
      }
    });
  }
  return queryDb;
}
// module.exports = { applyFilter };
export default applyFilter;
