import { RequestHandler } from 'express';
import User from '../models/user';

export const postUser: RequestHandler = (req, res, next) => {
  let userEmail = req.body.useremail;
  let name = req.body.name;
  let user = new User(userEmail, name);
  user
    .save()
    .then((user) => res.json(user))
    .catch((error) => res.json(error));
};

export const getUsers: RequestHandler = (req, res, next) => {
  User.fetchAll()
    .then((rows) => res.json(rows))
    .catch((error) => res.json(error));
};

export const getOneUser: RequestHandler = (req, res, next) => {
  let userId = req.params.userId;
  User.fetchById(userId)
    .then((rows) => {
      res.json(rows[0]);
    })
    .catch((error) => res.json(error));
};
