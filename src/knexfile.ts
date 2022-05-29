const knexfile: { [index: string]: any } = {
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: 'src/migrations',
      loadExtensions: ['.ts'],
    },
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: 'src/migrations',
      loadExtensions: ['.ts'],
    },
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

export default knexfile;
