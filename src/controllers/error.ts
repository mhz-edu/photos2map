import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const { message, data, statusCode = 500 } = error;
  res.status(statusCode).json({
    message: message,
    error: data,
  });
};

export default errorHandler;
