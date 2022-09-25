import { RequestHandler } from 'express';
import { sign } from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import User from '../models/user';
import { hashPassword } from '../util/authUtils';

interface IError extends Error {
  statusCode?: number;
  data: any;
}

export const postSignup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  let userEmail = req.body.useremail;
  let name = req.body.name;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed') as IError;
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    if (password !== confirmPassword) {
      const error = new Error('Validation failed') as IError;
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await hashPassword(password);
    let user = new User(userEmail, name, hashedPassword);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

export const postLogin: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  let userEmail = req.body.useremail;
  let password = req.body.password;
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed') as IError;
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    let user = await User.fetchByEmail(userEmail);
    if (!user) {
      const error = new Error('Unauthorized') as IError;
      error.statusCode = 401;
      throw error;
    }
    let providedPass = await hashPassword(password);
    if (user.password === providedPass) {
      const token = sign({ email: user.email }, 'my_secret', {
        expiresIn: '1h',
      });
      res.status(200).json({ token: token });
    } else {
      const error = new Error('Unauthorized') as IError;
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
