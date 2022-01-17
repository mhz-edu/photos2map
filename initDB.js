const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    debug: true,
    ssl: true
  });


  pg.schema.createTable('users', function (table) {
    table.increments();
    table.string('email');
    table.timestamps(false, true);
  }).then();