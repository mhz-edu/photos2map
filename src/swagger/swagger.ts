import { RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './swagger.json';

const host = process.env.NODE_APP_HOST || 'localhost:3000';
swaggerSpec.host = host;
const swaggerUiSetup = swaggerUi.setup(swaggerSpec);

const swaggerHandler = [...swaggerUi.serve, swaggerUiSetup];

export default swaggerHandler;
