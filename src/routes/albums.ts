import { Router } from 'express';
import { body } from 'express-validator';

import {
  getAlbums,
  getOneAlbum,
  postAlbum,
  getUserAlbums,
} from '../controllers/albums';

const albumsRouter = Router();

albumsRouter.post(
  '/',
  [body('title').not().isEmpty(), body('user_id').not().isEmpty().isInt()],
  postAlbum
);

albumsRouter.get('/:albumId', getOneAlbum);

albumsRouter.get('/', getAlbums);

albumsRouter.get('/:userId/albums', getUserAlbums);

export default albumsRouter;
