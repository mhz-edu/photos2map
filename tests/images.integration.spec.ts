import { describe, it, after, before, afterEach } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';

import { app } from '../src/app';
import pg from '../src/db';

const epsilon = 0.000001;

describe('Images', function () {
  before(async function () {
    const user1 = { email: 'test1@test.com', name: 'test1' };
    const album1 = { user_id: 1, title: 'test album' };

    await pg('users').insert(user1);
    await pg('albums').insert(album1);
  });

  after(async function () {
    await pg.raw('DELETE FROM images;');
    await pg.raw('DELETE FROM albums;');
    await pg.raw('DELETE FROM users;');
  });

  afterEach(async function () {
    await pg.raw('DELETE FROM images;');
  });

  describe('GET images', function () {
    it('should return array of images for given album', async function () {
      const image1 = { album_id: 1, lat: -33.85616, lon: 151.21526 };

      const [imageFromDb] = await pg('images').insert(image1).returning('*');

      const { body: retImage } = await request(app)
        .get('/api/albums/1/images')
        .expect('Content-Type', /application\/json/)
        .expect(200);

      expect(retImage).to.be.an('array');
      expect(retImage.length).to.be.equal(1);
      expect(retImage[0].album_id).to.be.equal(image1.album_id);
      expect(retImage[0].lat).to.be.closeTo(image1.lat, epsilon);
      expect(retImage[0].lon).to.be.closeTo(image1.lon, epsilon);
    });

    it('should return empty array when album has no images', async function () {
      await request(app)
        .get('/api/albums/1/images')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[]');
    });

    it('should return 404 Album not found error', async function () {
      await request(app)
        .get('/api/albums/2/images')
        .expect('Content-Type', /application\/json/)
        .expect(404)
        .expect('"Album not found"');
    });
  });

  describe('POST images', function () {
    it('should returned 201 and coordinates extracted from valid image', async function () {
      const { body: retImage } = await request(app)
        .post('/api/albums/1/images')
        .attach('upfile', 'tests/test_file.jpg')
        .expect('Content-Type', /application\/json/)
        .expect(201);

      expect(retImage).to.be.an('array');
      expect(retImage.length).to.be.equal(1);
      expect(retImage[0].album_id).to.be.equal(1);
      expect(retImage[0].lat).to.be.closeTo(26.582516, epsilon);
      expect(retImage[0].lon).to.be.closeTo(-80.20023, epsilon);
    });

    it('should return 422 validation error when no files', async function () {
      const { body: body } = await request(app)
        .post('/api/albums/1/images')
        .attach('upfile', '')
        .expect('Content-Type', /application\/json/)
        .expect(422);

      expect(body).to.be.equal('No files');
    });
  });
});
