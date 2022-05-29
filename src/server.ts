import { app } from './app';
import pg from './db';

pg.migrate
  .latest()
  .then((result) => {
    console.log(result);
    console.log('DB is migrated');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Starting listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
