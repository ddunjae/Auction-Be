const { USER_ROLE } = require("../utils/strVar");

const authorModel = (knex) => {
  return knex.schema.hasTable("artist").then(function (exists) {
    if (!exists) {
      return knex.schema.createTable("artist", function (property) {
        property.increments("id").unsigned().primary();
        property.string("kor", 255).notNullable();
        property.string("eng", 255).notNullable();
        property.string("birth", 255).notNullable();
        property.string("death", 255);
        property.string("class", 255);
        property.string("group", 255);
        property.boolean("is_deleted").defaultTo(false);
        property
          .datetime("created_at")
          .notNullable()
          .defaultTo(knex.raw("NOW()"));
        property.datetime("updated_at");
      });
    }
  });
};

module.exports = {
  authorModel,
};
