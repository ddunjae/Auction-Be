import mysql from "mysql2";
import dotenv from "dotenv";
import CONFIG from "./config";
import LOGGER from "../utils/logger";

require("dotenv").config();

const { DB_CONFIG } = CONFIG;
const knex = require("knex")(DB_CONFIG);

knex.on("query", LOGGER.DB.query);
knex.on("query-error", LOGGER.DB.error.bind(LOGGER.DB));

function initialize() {
  // user
  // require("../api/db-schemas/user").userModel(knex);
  // // require("../db-schemas/admin").adminModel(knex);
  // // artist
  // require("../api/db-schemas/auther").artistModel(knex);
  // //auction company
  // require("../api/db-schemas/auction_company").companyModel(knex);
  // //to USD
  // require("../api/db-schemas/currency").currencyModel(knex);
  // require("../api/db-schemas/auction_solution").resultModel(knex);

  require("../db-schemas/user").userModel(knex);
  require("../db-schemas/author").authorModel(knex);
  require("../db-schemas/aution_solution").autionSolutionModel(knex);
  require("../db-schemas/currency").currencyModel(knex);
  require("../db-schemas/auction_company").auctionCompanyrModel(knex);
}
initialize();
module.exports = knex;
