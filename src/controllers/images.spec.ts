import { describe, it, afterEach } from 'mocha';
import { stub, SinonSpy, assert, restore, replace } from 'sinon';
import { Request, Response, Express } from 'express';

import { getAlbumImages, postMultiImage } from './images';

import Image from '../models/image';
import Album from '../models/album';
import * as cu from '../util/coordinatesUtils';

describe('Images controller', function () {
  afterEach(function () {
    restore();
  });

  describe('GET images', function () {
    it('should return an array of album images', async function () {
      const req = {
        params: {
          albumId: '1',
        },
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const imageArray = [new Image(1, 1, 2), new Image(1, 3, 4)];
      const album = new Album(1, 'test');

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(album);
      });

      const imageStub = stub(Image, 'fetchAllByAlbumId').callsFake(
        (id: number) => {
          return Promise.resolve(id === 1 ? imageArray : []);
        }
      );

      await getAlbumImages(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 200);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, imageArray);
    });

    it('should return an empty array of album has no images', async function () {
      const req = {
        params: {
          albumId: '1',
        },
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const imageArray = [] as Image[];
      const album = new Album(1, 'test');

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(album);
      });
      const imageStub = stub(Image, 'fetchAllByAlbumId').callsFake(
        (id: number) => {
          return Promise.resolve(id === 1 ? imageArray : []);
        }
      );

      await getAlbumImages(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 200);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, imageArray);
    });

    it('should return 404 and album not found error', async function () {
      const req = {
        params: {
          albumId: '100',
        },
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const imageArray = [new Image(1, 1, 2)];

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(undefined);
      });
      const imageStub = stub(Image, 'fetchAllByAlbumId').callsFake(
        (id: number) => {
          return Promise.resolve(id === 1 ? imageArray : []);
        }
      );

      await getAlbumImages(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 404);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, 'Album not found');
    });

    it('should call next middleware in case of DB error on checking album existance', async function () {
      const req = {
        params: {
          albumId: '1',
        },
      } as Partial<Request>;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        throw dbError;
      });

      await getAlbumImages(req as Request, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });

    it('should call next middleware in case of DB error on fetching images', async function () {
      const req = {
        params: {
          albumId: '1',
        },
      } as Partial<Request>;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');
      const album = new Album(1, 'test');

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(album);
      });
      const imageStub = stub(Image, 'fetchAllByAlbumId').callsFake(
        (id: number) => {
          throw dbError;
        }
      );

      await getAlbumImages(req as Request, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });
  });

  describe('POST images', function () {
    it('should return 201 and json of saved image coordinates', async function () {
      const req = {
        params: {
          albumId: '1',
        },
        files: [{ buffer: Buffer.alloc(1) } as Express.Multer.File],
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const imageArray = [new Image(1, -33.856159, 151.215256)];
      const album = new Album(1, 'test');
      const gpsParams = {
        GPSLatitude: [33, 51, 22.1724],
        GPSLongitude: [151, 12, 54.9216],
        GPSLatitudeRef: 'S',
        GPSLongitudeRef: 'E',
      };

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(album);
      });

      const imageStub = stub(Image, 'saveMultiple').callsFake(() => {
        return Promise.resolve(imageArray);
      });
      const exctractGpsStub = stub(cu, 'extractExifGps').callsFake(() => {
        return Promise.resolve(gpsParams);
      });

      await postMultiImage(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 201);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, imageArray);
    });

    it('should return 404 and No album error if there is no album found', async function () {
      const req = {
        params: {
          albumId: '1',
        },
        files: [],
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const imageArray = [new Image(1, -33.856159, 151.215256)];
      const album = new Album(1, 'test');

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(undefined);
      });
      const imageStub = stub(Image, 'saveMultiple').callsFake(() => {
        return Promise.resolve(imageArray);
      });

      await postMultiImage(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 404);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, 'Album not found');
    });

    it('should return 422 and No files error if no files were provided', async function () {
      const req = {
        params: {
          albumId: '1',
        },
        files: [],
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const imageArray = [new Image(1, -33.856159, 151.215256)];
      const album = new Album(1, 'test');

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(album);
      });
      const imageStub = stub(Image, 'saveMultiple').callsFake(() => {
        return Promise.resolve(imageArray);
      });

      await postMultiImage(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 422);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, 'No files');
    });

    it('should return 422 and No files error if no files were provided', async function () {
      const req = {
        params: {
          albumId: '1',
        },
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const imageArray = [new Image(1, -33.856159, 151.215256)];
      const album = new Album(1, 'test');

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(album);
      });
      const imageStub = stub(Image, 'saveMultiple').callsFake(() => {
        return Promise.resolve(imageArray);
      });

      await postMultiImage(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 422);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, 'No files');
    });

    it('should call next middleware in case of DB error on checking album existance', async function () {
      const req = {
        params: {
          albumId: '1',
        },
      } as Partial<Request>;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        throw dbError;
      });

      await postMultiImage(req as Request, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });

    it('should call next middleware in case of DB error on saving images', async function () {
      const req = {
        params: {
          albumId: '1',
        },
        files: [{} as Express.Multer.File],
      } as Partial<Request>;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');
      const album = new Album(1, 'test');
      const gpsParams = {
        GPSLatitude: [33, 51, 22.1724],
        GPSLongitude: [151, 12, 54.9216],
        GPSLatitudeRef: 'S',
        GPSLongitudeRef: 'E',
      };

      const albumStub = stub(Album, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(album);
      });
      const imageStub = stub(Image, 'saveMultiple').callsFake((images) => {
        throw dbError;
      });
      const exctractGpsStub = stub(cu, 'extractExifGps').callsFake(() => {
        return Promise.resolve(gpsParams);
      });

      await postMultiImage(req as Request, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });
  });
});
