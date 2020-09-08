import express from 'express';
import { getRepository } from 'typeorm';

import User from './models/User';

const routes = express.Router();

routes.get('/', async (req, res) => {
  const usersRepository = getRepository(User);

  const user = usersRepository.create({
    name: 'Mariana',
    email: 'mariana@gmail.com',
    password_hash: 'smzkmzsnjsss56snkw'
  });

  await usersRepository.save(user);
});

export default routes;
