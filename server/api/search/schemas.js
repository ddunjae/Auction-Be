import ajvInstance from "../../utils/ajv";
import filter_v1 from "../../validate-schemas/filter_v1";

const filtering = {
  type: "object",
  properties: {
    from: filter_v1.from,
    to: filter_v1.to,
    date: filter_v1.date,
    success: filter_v1.success,
    bid_class: filter_v1.bid_class,
    pricetp: filter_v1.pricetp,
    price: filter_v1.price,
    title_search: filter_v1.title_search,
    material_search: filter_v1.material_search,
    mfgDate: filter_v1.mfgDate,
    height: filter_v1.height,
    width: filter_v1.width,
    on_off: filter_v1.onoff,
    certification: filter_v1.certification,
    artist_search: filter_v1.artist_search,
  },
  additionalProperties: true,
};

// import filter from "../../validate-schemas/filter";

// const filtering = {
//   type: "object",
//   properties: {
//     date_from: filter.date_from,
//     date_to: filter.date_to,
//     success: filter.success,
//     bid_class: filter.bid_class,
//     withdraw: filter.withdraw,
//     company: filter.company,
//     location: filter.location,
//     material_kind: filter.material_kind,
//     material_query: filter.material_query,
//     on_off: filter.on_off,
//     title_query: filter.title_query,
//     artist_query: filter.artist_query,
//     height_min: filter.height_min,
//     height_max: filter.height_max,
//     width_min: filter.width_min,
//     width_max: filter.width_max,
//     price_type: filter.price_type,
//     price_min: filter.price_min,
//     price_max: filter.price_max,
//     mfg_date_min: filter.mfg_date_min,
//     mfg_date_max: filter.mfg_date_max,
//     certification: filter.certi,
//     list: filter.list,
//     page: filter.page,
//   },
//   additionalProperties: true,
// };

const filteringSchema = ajvInstance.compile(filtering);
export { filteringSchema };
