import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.createTable('albums', function (table) {
    table.increments('id');
    table.string('title').notNullable();
    table.integer('user_id');
    table.timestamps(true, true);
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('albums');
};
