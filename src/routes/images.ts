import { Router } from 'express';
import multer from 'multer';

import { getAlbumImages, postImage } from '../controllers/images';

const imagesRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

imagesRouter.get('/api/albums/:albumId/images', getAlbumImages);

imagesRouter.post(
  '/api/albums/:albumId/images',
  upload.single('upfile'),
  postImage
);

export default imagesRouter;
