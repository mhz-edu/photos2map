import { Router } from 'express';

import { getAlbums, getOneAlbum, postAlbum } from '../controllers/albums';

const albumsRouter = Router();

albumsRouter.post('/api/albums', postAlbum);

albumsRouter.get('/api/albums/:albumId', getOneAlbum);

albumsRouter.get('/api/albums', getAlbums);

export default albumsRouter;
