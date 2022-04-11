import express, { ErrorRequestHandler, RequestHandler } from 'express';

import usersRouter from './routes/users';
import imagesRouter from './routes/images';
import albumsRouter from './routes/albums';

const app = express();

app.use(express.json());
app.use('/api/users', usersRouter);
app.use(imagesRouter);
app.use('/api/albums', albumsRouter);

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const data = error.data;
  const message = error.message;
  res.status(statusCode).json({
    message: message,
    error: data,
  });
};

app.use(errorHandler);

app.listen(process.env.PORT || 3000);
