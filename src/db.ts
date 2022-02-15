import knex from 'knex';
import knexfile from './knexfile';

const pg = knex(knexfile.development);

export default pg;
