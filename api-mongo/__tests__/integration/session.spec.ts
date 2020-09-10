import mongoose from 'mongoose';
import request from 'supertest';

import app from '../../src/app';
import User from '../../src/models/User';
import truncate from '../utils/truncate';

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
      password: '123123',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      });

      expect(response.status).toBe(200);
  });
});