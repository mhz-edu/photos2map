import { Router } from 'express';

import {
  postUser,
  getOneUser,
  getUsers,
  getUserAlbums,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.post('/api/users', postUser);

usersRouter.get('/api/users/:userId', getOneUser);

usersRouter.get('/api/users', getUsers);

usersRouter.get('/api/users/:userId/albums', getUserAlbums);

export default usersRouter;
