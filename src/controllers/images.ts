import { RequestHandler } from 'express';
const { ExifImage } = require('exif');

import Image from '../models/image';
import coordinatesConverter from '../util/coordinatesConverter';

export const postImage: RequestHandler = (req, res) => {
  let albumId = parseInt(req.params.albumId);
  new Promise(function (resolve, reject) {
    new ExifImage(
      { image: req.file!.buffer },
      (error: Error, exifData: any) => {
        if (error) {
          console.log(`Error: ${error.message}`);
          reject(error);
        } else {
          console.log(exifData.gps);
          resolve(exifData.gps);
        }
      }
    );
  })
    .then((gps) => {
      const coords = coordinatesConverter(gps);
      const img = new Image(albumId, coords.lat, coords.lon);
      return img.save();
    })
    .then((result) => res.json(result))
    .catch((error) => res.json(error));
};

export const getAlbumImages: RequestHandler = (req, res) => {
  let albumId = parseInt(req.params.albumId);
  Image.fetchAllByAlbumId(albumId)
    .then((images) => res.json(images))
    .catch((error) => console.log(error));
};
