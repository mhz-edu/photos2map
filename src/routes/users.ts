import { Router } from 'express';
import { body } from 'express-validator';

import { postUser, getOneUser, getUsers } from '../controllers/users';

const usersRouter = Router();

usersRouter.post(
  '/',
  [
    body('name').not().isEmpty(),
    body('useremail').isEmail().not().isEmpty().normalizeEmail(),
  ],
  postUser
);

usersRouter.get('/:userId', getOneUser);

usersRouter.get('/', getUsers);

export default usersRouter;
