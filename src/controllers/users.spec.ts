import { describe, it, before, afterEach } from 'mocha';
import { assert, SinonSpy, stub, restore } from 'sinon';
import { Request, Response } from 'express';

import { postUser, getUsers, getOneUser } from './users';

import User from '../models/user';

describe('Users controller', function () {
  afterEach(function () {
    restore();
  });

  describe('POST users', function () {
    it('controller sets status to 201 and returns json of created user', async function () {
      const req = {
        body: { useremail: 'test@test.com', name: 'test' },
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
      await postUser(req, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 201);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, user);
    });

    it('should call next middleware on posting user without email', async function () {
      const req = {
        body: { name: 'test_no_email' },
      } as Request;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');

      const userStub = stub(User.prototype, 'save').callsFake(() => {
        throw dbError;
      });

      await postUser(req, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });

    it('should call next middleware on posting user without name', async function () {
      const req = {
        body: { useremail: 'test1@test.com' },
      } as Request;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');

      const userStub = stub(User.prototype, 'save').callsFake(() => {
        throw dbError;
      });

      await postUser(req, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });
  });

  describe('GET users', function () {
    it('should return empty array when no users', async function () {
      const req = {} as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const userStub = stub(User, 'fetchAll').callsFake(() => {
        return Promise.resolve([]);
      });

      await getUsers(req, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 200);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, []);
    });

    it('should return array of users', async function () {
      const req = {} as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const users = [
        new User('test1@test.com', 'test1'),
        new User('test2@test.com', 'test2'),
      ];

      const userStub = stub(User, 'fetchAll').callsFake(() => {
        return Promise.resolve(users);
      });

      await getUsers(req, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 200);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, users);
    });

    it('should call next middleware in case of DB error', async function () {
      const req = {} as Request;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');

      const userStub = stub(User, 'fetchAll').callsFake(() => {
        throw dbError;
      });

      await getUsers(req, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });
  });

  describe('GET one user', function () {
    it('should return status 404 and no user error when user is not found', async function () {
      const req = {
        params: {
          userId: '100',
        },
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const user = new User('test@test.com', 'test');

      const userStub = stub(User, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(id === 1 ? user : undefined);
      });

      await getOneUser(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 404);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, 'User not found');
    });

    it('should return status 200 and found user', async function () {
      const req = {
        params: {
          userId: '1',
        },
      } as Partial<Request>;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = stub(res, 'json').returns(res);
      res.status = stub(res, 'status').returns(res);

      const user = new User('test@test.com', 'test');

      const userStub = stub(User, 'fetchById').callsFake((id: number) => {
        return Promise.resolve(id === 1 ? user : undefined);
      });

      await getOneUser(req as Request, res, () => {});

      assert.called(res.status as SinonSpy);
      assert.calledWith(res.status as SinonSpy, 200);
      assert.called(res.json as SinonSpy);
      assert.calledWith(res.json as SinonSpy, user);
    });

    it('should call next middleware in case of DB error', async function () {
      const req = {
        params: {
          userId: '1',
        },
      } as Partial<Request>;
      const res = {} as Response;
      const next = stub();

      const dbError = new Error('stubbed DB error');

      const userStub = stub(User, 'fetchById').callsFake(() => {
        throw dbError;
      });

      await getOneUser(req as Request, res, next);

      assert.called(next);
      assert.calledWith(next, dbError);
    });
  });
});
