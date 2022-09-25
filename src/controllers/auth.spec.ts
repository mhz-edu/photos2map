import { describe, it, before, afterEach } from 'mocha';
import Sinon, { assert, SinonSpy, stub, restore, match } from 'sinon';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { postSignup, postLogin } from './auth';
import * as authUtils from '../util/authUtils';

import User from '../models/user';

interface IError extends Error {
  statusCode?: number;
  data: any;
}

describe('Auth controller', function () {
  afterEach(function () {
    restore();
  });

  describe('POST signup', function () {
    it('controller sets status to 201 and returns json of created user', async function () {
      const req = {
        body: {
          useremail: 'test@test.com',
          name: 'test',
          password: 'test',
          confirmPassword: 'test',
        },
      } as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const user = new User('test@test.com', 'test');

      const userStub = stub(User.prototype, 'save').callsFake(() => {
        return Promise.resolve(user);
      });
      await postSignup(req, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 201);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, user);
    });

    it("should call next middleware on posting when password and cofirmation don't match", async function () {
      const req = {
        body: {
          useremail: 'test1@test.com',
          name: 'test_no_email',
          password: 'test100',
          confirmPassword: 'test',
        },
      } as Request;
      const res = {} as Response;
      const next = stub();

      await postSignup(req, res, next);

      assert.called(next);
      assert.calledWith(next, match.has('message', 'Validation failed'));
      assert.calledWith(next, match.has('statusCode', 422));
    });

    it('should call next middleware on DB error during save', async function () {
      const req = {
        body: {
          useremail: 'test1@test.com',
          name: 'test',
          password: 'test',
          confirmPassword: 'test',
        },
      } as Request;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');

      const userStub = stub(User.prototype, 'save').callsFake(() => {
        throw dbError;
      });

      await postSignup(req, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });
  });

  describe('POST login', function () {
    it('should return token on successfull login', async function () {
      const req = {
        body: {
          useremail: 'test@test.com',
          password: 'test',
        },
      } as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const hashedPwd = 'test';
      const user = new User('test@test.com', 'test', hashedPwd);

      const userStub = stub(User, 'fetchByEmail').callsFake((email: string) => {
        return Promise.resolve(user);
      });

      const hashStub = stub(authUtils, 'hashPassword').callsFake(() => {
        return Promise.resolve(hashedPwd);
      });

      const jwtSignStub = stub(jwt, 'sign').callsFake(() => {
        return 'testToken';
      });

      await postLogin(req, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 200);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, { token: 'testToken' });
    });

    it('should return 401 Unauthorized if password is incorrect', async function () {
      const req = {
        body: {
          useremail: 'test@test.com',
          password: 'test100',
        },
      } as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);
      const next = stub();

      const user = new User('test@test.com', 'test', 'test');

      const userStub = stub(User, 'fetchByEmail').callsFake((email: string) => {
        return Promise.resolve(user);
      });

      await postLogin(req, res, next);

      assert.called(next);
      assert.calledWith(next, match.has('message', 'Unauthorized'));
      assert.calledWith(next, match.has('statusCode', 401));
    });

    it('should return 401 Unauthorized if user is not found', async function () {
      const req = {
        body: {
          useremail: 'test@test.com',
          password: 'test100',
        },
      } as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);
      const next = stub();

      const userStub = stub(User, 'fetchByEmail').callsFake((email: string) => {
        return Promise.resolve(undefined);
      });

      await postLogin(req, res, next);

      assert.called(next);
      assert.calledWith(next, match.has('message', 'Unauthorized'));
      assert.calledWith(next, match.has('statusCode', 401));
    });

    it('should call next middleware on error during token genration', async function () {
      const req = {
        body: {
          useremail: 'test@test.com',
          password: 'test100',
        },
      } as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);
      const next = stub();

      const hashedPwd = 'test';
      const user = new User('test@test.com', 'test', hashedPwd);

      const userStub = stub(User, 'fetchByEmail').callsFake((email: string) => {
        return Promise.resolve(user);
      });

      const hashStub = stub(authUtils, 'hashPassword').callsFake(() => {
        return Promise.resolve(hashedPwd);
      });

      const jwtSignError = new Error('stubbed JWT sign error');

      const jwtSignStub = stub(jwt, 'sign').callsFake(() => {
        throw jwtSignError;
      });

      await postLogin(req, res, next);

      assert.called(next);
      assert.calledWith(next, jwtSignError);
    });
  });
});
