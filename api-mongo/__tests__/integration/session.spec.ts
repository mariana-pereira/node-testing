import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import User from '../../src/models/User';
import truncate from '../utils/truncate';
import authConfig from '../../src/config/auth.json';

describe('Authentication', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://localhost:27017/tests', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
     });
  });

  afterEach(async () => {
    await truncate(mongoose);
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  it('should authenticate with valid credentials', async () => {
    const user = await User.create({
      name: 'Mariana',
      email: 'mari@gmail.com',
      password: '123456',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      });

      expect(response.status).toBe(200);
  });

  it('should not authenticate with invalid credentials', async () => {
    const user = await User.create({
      name: 'Mariana',
      email: 'mari@gmail.com',
      password: '123456',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123'
      });

      expect(response.status).toBe(400);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await User.create({
      name: 'Mariana',
      email: 'mari@gmail.com',
      password: '123456',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const user = await User.create({
      name: 'Mariana',
      email: 'mari@gmail.com',
      password: '123456',
    });

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400,
    });

    const response = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes without jwt token', async () => {
    const response = await request(app).get('/projects');

    expect(response.status).toBe(401);
  });

  it('should not be able to access private routes with invalid jwt token', async () => {
    const response = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer 123123`)

    expect(response.status).toBe(401);
  });
});