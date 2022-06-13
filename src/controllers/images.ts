import { RequestHandler, Express } from 'express';

import Image from '../models/image';
import { coordinatesConverter, extractExifGps } from '../util/coordinatesUtils';
import Album from '../models/album';

interface IError extends Error {
  statusCode?: number;
  data: any;
}

export const postMultiImage: RequestHandler = async (req, res, next) => {
  let albumId = parseInt(req.params.albumId);
  try {
    const album = await Album.fetchById(albumId);
    if (!album) {
      return res.status(404).json('Album not found');
    }
    if (!req.files || req.files.length == 0) {
      return res.status(422).json('No files');
    }
    const files = req.files as Express.Multer.File[];
    const gpsArray = await Promise.all(
      files.map((file) => {
        return extractExifGps(file);
      })
    );
    const coordsArray = gpsArray.map(coordinatesConverter);
    const images = coordsArray.map((coords) => {
      return new Image(albumId, coords.lat, coords.lon);
    });
    const result = await Image.saveMultiple(images);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAlbumImages: RequestHandler = async (req, res, next) => {
  let albumId = parseInt(req.params.albumId);
  try {
    const album = await Album.fetchById(albumId);
    if (album) {
      const images = await Image.fetchAllByAlbumId(albumId);
      return res.status(200).json(images);
    }
    res.status(404).json('Album not found');
  } catch (error) {
    next(error);
  }
};
