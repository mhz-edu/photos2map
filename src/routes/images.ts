import { Router } from 'express';
import multer from 'multer';

import { getAlbumImages, postMultiImage } from '../controllers/images';

const imagesRouter = Router();

const MAX_FILE_SIZE = 10000000; //bytes

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
      return cb(null, true);
    }
    cb(null, false);
  },
});

imagesRouter.get('/api/albums/:albumId/images', getAlbumImages);

imagesRouter.post(
  '/api/albums/:albumId/images',
  upload.array('upfile', 10),
  postMultiImage
);

export default imagesRouter;
