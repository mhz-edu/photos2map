import { Router } from 'express';
import { body } from 'express-validator';

import { postLogin, postSignup } from '../controllers/auth';

const authRouter = Router();

authRouter.post(
  '/login',
  [
    body('useremail').isEmail().not().isEmpty().normalizeEmail(),
    body('password').not().isEmpty().isString(),
  ],
  postLogin
);

authRouter.post(
  '/signup',
  [
    body('useremail').isEmail().not().isEmpty().normalizeEmail(),
    body('password').not().isEmpty().isString(),
    body('confirmPassword').not().isEmpty().isString(),
  ],
  postSignup
);

export default authRouter;
