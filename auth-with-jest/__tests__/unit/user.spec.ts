import { getConnection } from 'typeorm';
import bcrypt from 'bcryptjs';

import truncate from '../utils/truncate';

import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password', async () => {
    const usersRepository = getConnection('test').getRepository(User);

    const user = usersRepository.create({
      name: 'Mariana',
      email: 'mariana@gmail.com',
      password_hash: await bcrypt.hash('123456', 8)
    });

    const hash = await bcrypt.hash('123456', 8);

    await usersRepository.save(user);

    expect(await bcrypt.compare('123456', user.password_hash)).toBe(true);
  });
});
