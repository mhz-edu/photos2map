import { describe, it, after } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';

import { app } from '../src/app';
import pg from '../src/db';

describe('GET users', function () {
  it('should return empty array when no users in DB', async function () {
    await request(app)
      .get('/api/users')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect('[]');
  });

  it('should return array of two users from DB', async function () {
    const user1 = { email: 'test1@test.com', name: 'test1' };
    const user2 = { email: 'test2@test.com', name: 'test2' };

    await pg('users').insert(user1);
    await pg('users').insert(user2);

    const { body: retUsers } = await request(app)
      .get('/api/users')
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(retUsers).to.be.an('array');
    expect(retUsers[0].name).to.be.equal(user1.name);
    expect(retUsers[0].email).to.be.equal(user1.email);
    expect(retUsers[1].name).to.be.equal(user2.name);
    expect(retUsers[1].email).to.be.equal(user2.email);
  });
});

describe('GET users/:userId', function () {
  it('should return found user', async function () {
    const user3 = { email: 'test3@test.com', name: 'test3' };

    const [userFromDb] = await pg('users').insert(user3).returning('id');

    const { body: retUser } = await request(app)
      .get('/api/users/' + userFromDb)
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(retUser).to.be.an('object');
    expect(retUser.name).to.be.equal(user3.name);
    expect(retUser.email).to.be.equal(user3.email);
  });

  it('should return 404 when user is not found', async function () {
    await request(app)
      .get('/api/users/100')
      .expect('Content-Type', /application\/json/)
      .expect(404)
      .expect('"User not found"');
  });
});

describe('POST users', function () {
  it('should returned created user', async function () {
    const user = {
      name: 'test',
      useremail: 'test@test.com',
    };
    const { body: retUser } = await request(app)
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(201);

    expect(retUser).to.be.an('object');
    expect(retUser.name).to.be.equal(user.name);
    expect(retUser.email).to.be.equal(user.useremail);
  });

  it('should return 422 validation error when passing user with no email', async function () {
    const user = {
      name: 'test',
    };
    const { body: body } = await request(app)
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(422);

    expect(body.message).to.be.equal('Validation failed');
    expect(body.error[0].param).to.be.equal('useremail');
  });

  it('should return 422 validation error when passing user with no name', async function () {
    const user = {
      email: 'test1@test.com',
    };
    const { body: body } = await request(app)
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(422);

    expect(body.message).to.be.equal('Validation failed');
    expect(body.error[0].param).to.be.equal('name');
  });

  it('should return 422 validation error when passing user with invalid email', async function () {
    const user = {
      email: 'test',
      name: 'test',
    };
    const { body: body } = await request(app)
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /application\/json/)
      .expect(422);

    expect(body.message).to.be.equal('Validation failed');
    expect(body.error[0].param).to.be.equal('useremail');
  });
});
