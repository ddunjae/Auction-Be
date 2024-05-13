import db from "../config/connectDB";
function applyFilter(connection, data) {
  let {
    date_from,
    date_to,
    success,
    withdraw,
    bid_class,
    company,
    location,
    material_kind,
    material_query,
    on_off,
    title_query,
    artist_query,
    height_min,
    height_max,
    width_min,
    width_max,
    price_type,
    price_min,
    price_max,
    mfg_date_min,
    mfg_date_max,
    certi,
  } = data;
  price_type = price_type || "hammer_price";
  const queryDb = connection.where("transact_date", "<=", db.raw("curdate()"));
  if (date_from) {
    queryDb.where(
      "transact_date",
      ">=",
      db.raw(`str_to_date(${date_from}, "%Y-%m-%d")`)
    );
  }
  if (date_to) {
    queryDb.where(
      "transact_date",
      "<=",
      db.raw(`str_to_date(${date_to}, "%Y-%m-%d")`)
    );
  }
  if (company) {
    queryDb.whereIn("company", company);
  }
  if (location) {
    queryDb.whereIn("location", location);
  }
  if (material_kind) {
    queryDb.where(function () {
      if (material_query) {
        this.whereIn("material_kind", material_kind)
          .orWhere("material_kor", "like", `%${material_query}%`)
          .orWhere("material_eng", "like", `%${material_query}%`);
      } else {
        this.whereIn("material_kind", material_kind);
      }
    });
  } else if (material_query) {
    queryDb.where(function () {
      this.orWhere("material_kor", "like", `%${material_query}%`).orWhere(
        "material_eng",
        "like",
        `%${material_query}%`
      );
    });
  }
  if (on_off) {
    queryDb.where("on_off", "=", on_off);
  }
  if (title_query) {
    queryDb.where(function () {
      this.orWhere("title_kor", "like", `%${title_query}%`).orWhere(
        "title_eng",
        "like",
        `%${title_query}%`
      );
    });
  }
  if (artist_query) {
    queryDb.where(function () {
      this.orWhere("artist_kor", "like", `%${artist_query}%`).orWhere(
        "artist_eng",
        "like",
        `%${artist_query}%`
      );
    });
  }
  if (height_min) {
    queryDb.where("height", ">=", height_min);
  }
  if (height_max) {
    queryDb.where("height", "<=", height_max);
  }
  if (width_min) {
    queryDb.where("width", ">=", width_min);
  }
  if (width_max) {
    queryDb.where("width", "<=", width_max);
  }
  if (price_min) {
    queryDb.where(`${price_type}`, ">=", price_min);
  }
  if (price_max) {
    queryDb.where(`${price_type}`, "<=", price_max);
  }
  if (mfg_date_min) {
    queryDb.where(db.raw("mid(mfg_date,1,4)"), ">=", mfg_date_min);
  }
  if (mfg_date_max) {
    queryDb.where(db.raw("mid(mfg_date,1,4)"), "<=", mfg_date_max);
  }
  if (certi != undefined) {
    if (certi) {
      queryDb.whereNotNull("certification");
    } else {
      queryDb.whereNull("certification");
    }
  }
  if (on_off != undefined) {
    if (certi) {
      queryDb.where("on_off", "=", "online");
    } else {
      queryDb.where("on_off", "=", "offline");
    }
  }
  if (success != undefined) {
    if (success) {
      queryDb.whereNotNull("hammer_price").where(function () {
        if (bid_class) {
          this.whereIn("bid_class", bid_class);
        }
      });
    } else {
      queryDb.whereNull("hammer_price").where(function () {
        if (withdraw != undefined) {
          if (withdraw) {
            this.where("bid_class", "=", "w/d");
          } else {
            tihs.where("bid_class", "!=", "w/d");
          }
        }
      });
    }
  }
  return queryDb;
}
// module.exports = { applyFilter };
export default applyFilter;
