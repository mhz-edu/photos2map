import { Router } from 'express';

import { postUser, getOneUser, getUsers } from '../controllers/users';

const usersRouter = Router();

usersRouter.post('/api/users', postUser);

usersRouter.get('/api/users/:userId', getOneUser);

usersRouter.get('/api/users', getUsers);

export default usersRouter;
