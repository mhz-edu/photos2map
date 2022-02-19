import express from 'express';

import usersRouter from './routes/users';
import imagesRouter from './routes/images';
import albumsRouter from './routes/albums';

const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(imagesRouter);
app.use(albumsRouter);

app.listen(process.env.PORT || 3000);
