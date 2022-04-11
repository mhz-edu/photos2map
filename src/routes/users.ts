import { Router } from 'express';

import {
  postUser,
  getOneUser,
  getUsers,
  getUserAlbums,
} from '../controllers/users';

const usersRouter = Router();

usersRouter.post('/', postUser);

usersRouter.get('/:userId', getOneUser);

usersRouter.get('/', getUsers);

usersRouter.get('/:userId/albums', getUserAlbums);

export default usersRouter;
