import { Knex } from "knex";

exports.up = function (knex: Knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("email").notNullable().unique();
    table.timestamps(true, true);
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable("users");
};
