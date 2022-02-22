import { RequestHandler } from 'express';
import User from '../models/user';
import Album from '../models/album';

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
