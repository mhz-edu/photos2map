import express, { ErrorRequestHandler, RequestHandler } from 'express';

import usersRouter from './routes/users';
import imagesRouter from './routes/images';
import albumsRouter from './routes/albums';
import errorHandler from './controllers/error';

const app = express();

app.use(express.json());
app.use('/api/users', usersRouter);
app.use(imagesRouter);
app.use('/api/albums', albumsRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 3000);
