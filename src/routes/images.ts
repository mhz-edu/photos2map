import { Router } from 'express';
import multer from 'multer';

const { ExifImage } = require('exif');

const imagesRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

imagesRouter.post('/api/file', upload.single('upfile'), (req, res) => {
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
  }).then(
    (result) => res.json(result),
    (error) => res.json(error)
  );
});

export default imagesRouter;
