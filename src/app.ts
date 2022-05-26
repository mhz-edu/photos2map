import express from 'express';

import usersRouter from './routes/users';
import imagesRouter from './routes/images';
import albumsRouter from './routes/albums';
import errorHandler from './controllers/error';
import swaggerHandler from './swagger/swaggerLoader';

export const app = express();

app.use('/api-doc', swaggerHandler);
app.use(express.json());
app.use('/api/users', usersRouter);
app.use(imagesRouter);
app.use('/api/albums', albumsRouter);

app.use(errorHandler);
