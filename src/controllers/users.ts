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
  } catch (err) {
    next(err);
  }
};

export const getUsers: RequestHandler = (req, res, next) => {
  User.fetchAll()
    .then((users) => res.json(users))
    .catch((error) => res.json(error));
};

export const getOneUser: RequestHandler = (req, res, next) => {
  let userId = parseInt(req.params.userId);
  User.fetchById(userId)
    .then((user) => {
      console.log(user);
      if (user) {
        res.json(user);
      }
      res.json('User not found');
    })
    .catch((error) => res.json(error));
};

export const getUserAlbums: RequestHandler = (req, res, next) => {
  let userId = parseInt(req.params.userId);
  Album.fetchAllByUserId(userId)
    .then((albums) => {
      res.json(albums);
    })
    .catch((error) => res.json(error));
};
