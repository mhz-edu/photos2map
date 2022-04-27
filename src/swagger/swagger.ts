import { RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './swagger.json';

const extractHost: RequestHandler = (req, res, next) => {
  swaggerSpec.host = req.hostname;
  next();
};

const swaggerHandler = [
  extractHost,
  ...swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
];

export default swaggerHandler;
