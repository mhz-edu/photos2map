import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { Request, Response } from 'express';

import { postUser } from './users';
import pg from '../db';
import User from '../models/user';

describe('Users controller', function () {
  before(function (done) {
    pg.migrate
      .latest({
        directory: './dist/migrations',
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  describe('POST user', function () {
    it('should save user with valid email and name to the DB', async function () {
      const req = {
        body: { useremail: 'test@test.com', name: 'test' },
      } as Request;
      let code: number = 500;
      let resBody: Partial<User> = {};
      const res = {
        status: function (newCode: number) {
          code = newCode;
          return this;
        },
        json: function (data: Object) {
          resBody = data;
          return this;
        },
      } as Response;

      await postUser(req, res, () => {});

      expect(code).to.be.equal(201);
      expect(resBody).to.have.property('name');
      expect(resBody).to.have.property('email');
      expect(resBody.name).to.be.equal('test');
      expect(resBody.email).to.be.equal('test@test.com');
    });

    it('should not save user without email', async function () {
      const req = {
        body: { name: 'test_no_email' },
      } as Request;

      const res = {} as Response;

      await postUser(req, res, () => {});
      const users = await User.fetchAll();
      const addedUser = users.find((item) => item.name === 'test_no_email');
      expect(addedUser).to.be.undefined;
    });

    it('should not save user without name', async function () {
      const req = {
        body: { useremail: 'test1@test.com' },
      } as Request;

      const res = {} as Response;

      await postUser(req, res, () => {});
      const users = await User.fetchAll();
      const addedUser = users.find((item) => item.email === 'test1@test.com');
      expect(addedUser).to.be.undefined;
    });
  });

  after(function (done) {
    pg.migrate
      .rollback(
        {
          directory: './dist/migrations',
        },
        true
      )
      .then(() => {
        pg.destroy();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
