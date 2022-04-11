import knex from 'knex';
import knexfile from './knexfile';

const env = process.env.NODE_ENV || 'development';

const pg = knex(knexfile[env]);

export default pg;
