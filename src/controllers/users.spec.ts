import { describe, it, beforeAll, jest, expect } from '@jest/globals';
import { Request, response, Response } from 'express';

import { postUser, getUsers, getOneUser } from './users';

import User from '../models/user';

jest.mock('../models/user');

describe('Users controller', function () {
  beforeAll(function () {
    jest.resetAllMocks();
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
      res.json = jest.fn(() => res);
      res.status = jest.fn(() => res);

      const user = new User('test@test.com', 'test');

      User.prototype.save = jest.fn().mockImplementationOnce(function () {
        return Promise.resolve(user);
      }) as () => Promise<User>;

      await postUser(req, res, () => {});

      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should call next middleware on posting user without email', async function () {
      const req = {
        body: { name: 'test_no_email' },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      const dbError = new Error('stubbed DB error');

      User.prototype.save = jest.fn().mockImplementationOnce(function () {
        throw dbError;
      }) as () => Promise<User>;

      await postUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(dbError);
    });

    it('should call next middleware on posting user without name', async function () {
      const req = {
        body: { useremail: 'test1@test.com' },
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      const dbError = new Error('stubbed DB error');

      User.prototype.save = jest.fn().mockImplementationOnce(function () {
        throw dbError;
      }) as () => Promise<User>;

      await postUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(dbError);
    });
  });

  describe('GET users', function () {
    it('should return empty array when no users', async function () {
      const req = {} as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = jest.fn(() => res);
      res.status = jest.fn(() => res);

      const users: User[] = [];

      User.fetchAll = jest.fn().mockImplementationOnce(function () {
        return Promise.resolve(users);
      }) as () => Promise<User[]>;

      await getUsers(req, res, () => {});

      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return array of users', async function () {
      const req = {} as Request;
      const res = {
        json: () => {},
        status: (code: number) => {},
      } as Response;
      res.json = jest.fn(() => res);
      res.status = jest.fn(() => res);

      const users = [
        new User('test1@test.com', 'test1'),
        new User('test2@test.com', 'test2'),
      ];

      User.fetchAll = jest.fn().mockImplementationOnce(function () {
        return Promise.resolve(users);
      }) as () => Promise<User[]>;

      await getUsers(req, res, () => {});

      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should call next middleware in case of DB error', async function () {
      const req = {} as Request;
      const res = {} as Response;
      const next = jest.fn();

      const dbError = new Error('stubbed DB error');

      User.fetchAll = jest.fn().mockImplementationOnce(function () {
        throw dbError;
      }) as () => Promise<User[]>;

      await getUsers(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(dbError);
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
      res.json = jest.fn(() => res);
      res.status = jest.fn(() => res);

      const user = new User('test@test.com', 'test');

      User.fetchById = jest.fn().mockImplementationOnce(function (id) {
        return Promise.resolve(id === 1 ? user : undefined);
      }) as (id: number) => Promise<User>;

      await getOneUser(req as Request, res, () => {});

      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith('User not found');
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
      res.json = jest.fn(() => res);
      res.status = jest.fn(() => res);

      const user = new User('test@test.com', 'test');

      User.fetchById = jest.fn().mockImplementationOnce(function (id) {
        return Promise.resolve(id === 1 ? user : undefined);
      }) as (id: number) => Promise<User>;

      await getOneUser(req as Request, res, () => {});

      expect(res.status).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should call next middleware in case of DB error', async function () {
      const req = {
        params: {
          userId: '1',
        },
      } as Partial<Request>;
      const res = {} as Response;
      const next = jest.fn();

      const dbError = new Error('stubbed DB error');

      User.fetchById = jest.fn().mockImplementationOnce(function (id) {
        throw dbError;
      }) as (id: number) => Promise<User>;

      await getOneUser(req as Request, res, next);

      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(dbError);
    });
  });
});
