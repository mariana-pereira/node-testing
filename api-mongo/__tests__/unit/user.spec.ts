import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import request from 'supertest';

import truncate from '../utils/truncate';
import app from '../../src/app';

import User from '../../src/models/User';

describe('User', () => {
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

  it('should encrypt user password', async () => {

    const user = await User.create({
      name: 'Mariana',
      email: 'mari@gmail.com',
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password);

    expect(compareHash).toBe(true);
  });

  it('should not create user with a repeated email', async () => {
    await User.create({
      name: 'Mariana',
      email: 'mari@gmail.com',
      password: '123123',
    });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Maria',
        email: 'mari@gmail.com',
        password: '123456'
      });

    expect(response.status).toBe(400);
  });
});