import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import truncate from '../utils/truncate';

import createConnection from '../utils/createConnection';

import User from '../../src/app/models/User';

let connection;

describe('Authentication', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterEach(async () => {
    await truncate(connection);
  });

  afterAll(async done => {
    await connection.close();
    done();
  });

  it('should authenticate with valid credentials', async () => {
    const usersRepository = connection.getRepository(User);

    const user = usersRepository.create({
      name: 'Mariana',
      email: 'mariana@gmail.com',
      password_hash: await bcrypt.hash('123123', 8)
    });

    await usersRepository.save(user);

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123'
      });

    expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const usersRepository = connection.getRepository(User);

    const user = usersRepository.create({
      name: 'Mariana',
      email: 'mariana@gmail.com',
      password_hash: await bcrypt.hash('123123', 8)
    });

    await usersRepository.save(user);

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const usersRepository = connection.getRepository(User);

    const user = usersRepository.create({
      name: 'Mariana',
      email: 'mariana@gmail.com',
      password_hash: await bcrypt.hash('123123', 8)
    });

    await usersRepository.save(user);

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123'
      });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const usersRepository = connection.getRepository(User);

    const user = usersRepository.create({
      name: 'Mariana',
      email: 'mariana@gmail.com',
      password_hash: await bcrypt.hash('123123', 8)
    });

    await usersRepository.save(user);

    const token = jwt.sign(user.id, '32a2c2aab06cbeac9ad4938808bda9d1');

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes without jwt token', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(401);
  });

  it('should not be able to access private routes with invalid jwt token', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer 123123`)

    expect(response.status).toBe(401);
  });
});
