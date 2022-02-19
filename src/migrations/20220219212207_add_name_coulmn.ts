import { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.alterTable('users', function (table) {
    table.string('name').notNullable();
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('name');
  });
};
