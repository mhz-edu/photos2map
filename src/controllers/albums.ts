import { RequestHandler } from 'express';
import Album from '../models/album';

export const postAlbum: RequestHandler = (req, res, next) => {
  let albumTitle = req.body.title;
  let userId = req.body.user_id;
  let album = new Album(userId, albumTitle);
  album
    .save()
    .then((album) => res.json(album))
    .catch((error) => res.json(error));
};

export const getAlbums: RequestHandler = (req, res, next) => {
  Album.fetchAll()
    .then((rows) => res.json(rows))
    .catch((error) => res.json(error));
};

export const getOneAlbum: RequestHandler = (req, res, next) => {
  let albumId = req.params.albumId;
  Album.fetchById(albumId)
    .then((rows) => {
      res.json(rows[0]);
    })
    .catch((error) => res.json(error));
};
