import request from 'supertest';
import app from 'index';

import { resetUsers} from '../../src/repositories/UserRepository';

const server = request(app);

describe('user CRUD', () => {
  beforeEach(() => {
    resetUsers();
  })

  test('should get empty user list', async () => {
    const response = await server.get('/api/users').send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('should create new user', async () => {
    const response = await server.post('/api/users').send({
      username: 'John Doe',
      age: 20,
      hobbies: ['sports', 'music'],
    });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('John Doe');
    expect(response.body.age).toBe(20);
    expect(response.body.hobbies).toEqual(['sports', 'music']);
  });

  test('should get user by id', async () => {
    const createResponse = await server.post('/api/users').send({
      username: 'John Doe',
      age: 20,
      hobbies: ['sports', 'music'],
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.id).toBeDefined();
    expect(createResponse.body.id).not.toBe('');

    const getResponse = await server.get(`/api/users/${createResponse.body.id}`).send();

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.username).toBe('John Doe');
    expect(getResponse.body.age).toBe(20);
    expect(getResponse.body.hobbies).toEqual(['sports', 'music']);
  });

  test('should update user by id', async () => {
    const createResponse = await server.post('/api/users').send({
      username: 'John Doe',
      age: 20,
      hobbies: ['sports', 'music'],
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.id).toBeDefined();
    expect(createResponse.body.id).not.toBe('');

    const putResponse = await server.put(`/api/users/${createResponse.body.id}`).send({
      username: 'John Terry',
      age: 45,
      hobbies: ['football', 'tennis'],
    });

    expect(putResponse.status).toBe(200);
    expect(putResponse.body.username).toBe('John Terry');
    expect(putResponse.body.age).toBe(45);
    expect(putResponse.body.hobbies).toEqual(['football', 'tennis']);
  });

  test('should remove user by id', async () => {
    const createResponse = await server.post('/api/users').send({
      username: 'John Doe',
      age: 20,
      hobbies: ['sports', 'music'],
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.id).toBeDefined();
    expect(createResponse.body.id).not.toBe('');

    const deleteResponse = await server.delete(`/api/users/${createResponse.body.id}`).send();

    expect(deleteResponse.status).toBe(204);
  });

  test('should get 404 after user removal', async () => {
    const createResponse = await server.post('/api/users').send({
      username: 'John Doe',
      age: 20,
      hobbies: ['sports', 'music'],
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.id).toBeDefined();
    expect(createResponse.body.id).not.toBe('');

    const deleteResponse = await server.delete(`/api/users/${createResponse.body.id}`).send();

    expect(deleteResponse.status).toBe(204);

    const getResponse = await server.get(`/api/users/${createResponse.body.id}`).send();

    expect(getResponse.status).toBe(404);
  });
})