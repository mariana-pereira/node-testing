import { getConnection } from 'typeorm';
import request from 'supertest';

import app from '../../src/app';
import truncate from '../utils/truncate';

import User from '../../src/app/models/User';

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should authenticate with valid credentials', async () => {
    const usersRepository = getConnection('test').getRepository(User);

    const user = usersRepository.create({
      name: 'Mariana',
      email: 'mariana@gmail.com',
      password_hash: '123123'
    });

    await usersRepository.save(user);

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123456'
      });

    expect(response.status).toBe(200);
  });
});
