import pg from '../src/db';

export const mochaGlobalSetup = async function () {
  console.log('Tests DB setup');
  await pg.migrate.latest();
  console.log('Test DB is ready');
};

export const mochaGlobalTeardown = async function () {
  await pg.migrate.rollback();
  console.log('Test DB is reset');
  await pg.destroy();
};
