const knexfile = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
    },
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      extension: "ts",
    },
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

export default knexfile;
