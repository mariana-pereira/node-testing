import bcrypt from 'bcryptjs';

import truncate from '../utils/truncate';
import createConnection from '../utils/createConnection';

import User from '../../src/app/models/User';

let connection;

describe('User', () => {
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

  it('should encrypt user password', async () => {
    const usersRepository = connection.getRepository(User);

    const user = usersRepository.create({
      name: 'Mariana',
      email: 'mariana@gmail.com',
      password_hash: await bcrypt.hash('123456', 8)
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });
});
