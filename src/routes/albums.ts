import { Router } from 'express';

import { getAlbums, getOneAlbum, postAlbum } from '../controllers/albums';

const albumsRouter = Router();

albumsRouter.post('/', postAlbum);

albumsRouter.get('/:albumId', getOneAlbum);

albumsRouter.get('/', getAlbums);

export default albumsRouter;
