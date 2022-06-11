import { RequestHandler, Express } from 'express';
import { ExifData, ExifImage } from 'exif';

import Image from '../models/image';
import coordinatesConverter from '../util/coordinatesConverter';
import Album from '../models/album';

interface IError extends Error {
  statusCode?: number;
  data: any;
}

const extractExifGps = (
  file: Express.Multer.File
): Promise<ExifData['gps']> => {
  return new Promise(function (resolve, reject) {
    new ExifImage(
      { image: file.buffer },
      (error: Error | null, exifData: ExifData) => {
        if (error) {
          console.log(`Error: ${error.message}`);
          reject(error);
        } else {
          console.log(exifData.gps);
          resolve(exifData.gps);
        }
      }
    );
  });
};

export const postMultiImage: RequestHandler = (req, res, next) => {
  let albumId = parseInt(req.params.albumId);
  Album.fetchById(albumId)
    .then((album) => {
      if (!album) {
        const error = new Error('Album not found') as IError;
        error.statusCode = 404;
        throw error;
      }
      if (!req.files || req.files.length == 0) {
        const error = new Error('No files') as IError;
        error.statusCode = 422;
        throw error;
      }
      const files = req.files as Express.Multer.File[];
      return Promise.all(
        files.map((file) => {
          return extractExifGps(file);
        })
      );
    })
    .then((gpsArray) => {
      const coordsArray = gpsArray.map(coordinatesConverter);
      const images = coordsArray.map((coords) => {
        return new Image(albumId, coords.lat, coords.lon);
      });
      return Image.saveMultiple(images);
    })
    .then((result) => res.status(201).json(result))
    .catch((error) => next(error));
};

export const getAlbumImages: RequestHandler = (req, res) => {
  let albumId = parseInt(req.params.albumId);
  Image.fetchAllByAlbumId(albumId)
    .then((images) => res.json(images))
    .catch((error) => console.log(error));
};
