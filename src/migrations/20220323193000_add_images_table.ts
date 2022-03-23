import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.createTable('images', function (table) {
    table.increments('id');
    table.integer('album_id');
    table.float('lat');
    table.float('lon');
    table.timestamps(true, true);
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('images');
};
