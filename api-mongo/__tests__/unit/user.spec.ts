import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import truncate from '../utils/truncate';

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
      email: 'mariana@gmail.com',
      password: '123456',
    });

    const hash = await bcrypt.hash('123456', 8);

    expect(await bcrypt.compare('123456', user.password)).toBe(true);
  });
});