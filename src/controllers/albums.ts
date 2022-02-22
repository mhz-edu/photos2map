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
