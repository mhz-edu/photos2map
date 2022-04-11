import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import Album from '../models/album';
import User from '../models/user';

interface IError extends Error {
  statusCode?: number;
  data: any;
}

export const postAlbum: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed') as IError;
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  let albumTitle = req.body.title;
  let userId = parseInt(req.body.user_id);
  User.fetchById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error(`User with id ${userId} not found`) as IError;
        error.statusCode = 422;
        error.data = [];
        throw error;
      }
      let album = new Album(userId, albumTitle);
      album.save().then((album) => res.json(album));
    })
    .catch((error) => next(error));
};

export const getAlbums: RequestHandler = (req, res, next) => {
  Album.fetchAll()
    .then((albums) => res.json(albums))
    .catch((error) => res.json(error));
};

export const getOneAlbum: RequestHandler = (req, res, next) => {
  let albumId = parseInt(req.params.albumId);
  Album.fetchById(albumId)
    .then((album) => {
      if (album) {
        res.json(album);
      }
      res.json('Album not found');
    })
    .catch((error) => res.json(error));
};
