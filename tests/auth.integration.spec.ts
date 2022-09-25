import { describe, it, after, afterEach } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';

import { app } from '../src/app';
import pg from '../src/db';

describe('Auth', function () {
  after(async function () {
    await pg.raw('DELETE FROM images;');
    await pg.raw('DELETE FROM albums;');
    await pg.raw('DELETE FROM users;');
  });

  afterEach(async function () {
    await pg.raw('DELETE FROM users;');
  });

  describe('POST signup', function () {
    it('should return created user', async function () {
      const user = {
        useremail: 'test@test.com',
        name: 'test',
        password: 'test',
        confirmPassword: 'test',
      };
      const { body: retUser } = await request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect('Content-Type', /application\/json/)
        .expect(201);

      expect(retUser).to.be.an('object');
      expect(retUser.name).to.be.equal(user.name);
      expect(retUser.email).to.be.equal(user.useremail);
    });

    it('should return 422 validation error when email was not provided', async function () {
      const user = {
        name: 'test',
        password: 'test',
        confirmPassword: 'test',
      };
      const { body: body } = await request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect('Content-Type', /application\/json/)
        .expect(422);

      expect(body.message).to.be.equal('Validation failed');
      expect(body.error[0].param).to.be.equal('useremail');
    });

    it('should return 422 validation error when password was not provided', async function () {
      const user = {
        useremail: 'test@test.com',
        name: 'test',
        confirmPassword: 'test',
      };
      const { body: body } = await request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect('Content-Type', /application\/json/)
        .expect(422);

      expect(body.message).to.be.equal('Validation failed');
      expect(body.error[0].param).to.be.equal('password');
    });

    it('should return 422 validation error when password confirmation was not provided', async function () {
      const user = {
        useremail: 'test@test.com',
        name: 'test',
        password: 'test',
      };
      const { body: body } = await request(app)
        .post('/api/auth/signup')
        .send(user)
        .expect('Content-Type', /application\/json/)
        .expect(422);

      expect(body.message).to.be.equal('Validation failed');
      expect(body.error[0].param).to.be.equal('confirmPassword');
    });
  });

  describe('POST login', function () {
    it('should return token for correct credentials of existing user', async function () {
      const signupUser = {
        useremail: 'test@test.com',
        name: 'test',
        password: 'test',
        confirmPassword: 'test',
      };

      await request(app).post('/api/auth/signup').send(signupUser);

      const loginUser = {
        useremail: 'test@test.com',
        password: 'test',
      };

      const { body } = await request(app)
        .post('/api/auth/login')
        .send(loginUser)
        .expect('Content-Type', /application\/json/)
        .expect(200);

      expect(body).to.haveOwnProperty('token');
      expect(body.token).to.be.string;
    });

    it('should return 401 Unathorized for incorrect credentials of existing user', async function () {
      const signupUser = {
        useremail: 'test@test.com',
        name: 'test',
        password: 'test',
        confirmPassword: 'test',
      };

      await request(app).post('/api/auth/signup').send(signupUser);

      const loginUser = {
        useremail: 'test@test.com',
        password: 'test100',
      };

      const { body } = await request(app)
        .post('/api/auth/login')
        .send(loginUser)
        .expect('Content-Type', /application\/json/)
        .expect(401);

      expect(body.message).to.be.equal('Unauthorized');
    });

    it('should return 401 Unathorized for credentials of NON-existing user', async function () {
      const signupUser = {
        useremail: 'test@test.com',
        name: 'test',
        password: 'test',
        confirmPassword: 'test',
      };

      await request(app).post('/api/auth/signup').send(signupUser);

      const loginUser = {
        useremail: 'test100@test.com',
        password: 'test100',
      };

      const { body } = await request(app)
        .post('/api/auth/login')
        .send(loginUser)
        .expect('Content-Type', /application\/json/)
        .expect(401);

      expect(body.message).to.be.equal('Unauthorized');
    });

    it('should return 422 validation error when email was not provided', async function () {
      const user = {
        password: 'test',
      };
      const { body: body } = await request(app)
        .post('/api/auth/login')
        .send(user)
        .expect('Content-Type', /application\/json/)
        .expect(422);

      expect(body.message).to.be.equal('Validation failed');
      expect(body.error[0].param).to.be.equal('useremail');
    });

    it('should return 422 validation error when password was not provided', async function () {
      const user = {
        useremail: 'test@test.com',
      };
      const { body: body } = await request(app)
        .post('/api/auth/login')
        .send(user)
        .expect('Content-Type', /application\/json/)
        .expect(422);

      expect(body.message).to.be.equal('Validation failed');
      expect(body.error[0].param).to.be.equal('password');
    });
  });
});
