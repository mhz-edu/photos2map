import express from 'express';

import usersRouter from './routes/users';
import imagesRouter from './routes/images';

const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(imagesRouter);

app.listen(process.env.PORT || 3000);
