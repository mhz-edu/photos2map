import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import User from '../models/user';
import Album from '../models/album';

interface IError extends Error {
  statusCode?: number;
  data: any;
}

export const postUser: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed') as IError;
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  let userEmail = req.body.useremail;
  let name = req.body.name;
  let user = new User(userEmail, name);
  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.fetchAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getOneUser: RequestHandler = async (req, res, next) => {
  let userId = parseInt(req.params.userId);
  try {
    const user = await User.fetchById(userId);
    if (user) {
      return res.status(200).json(user);
    }
    res.status(404).json('User not found');
  } catch (error) {
    next(error);
  }
};
