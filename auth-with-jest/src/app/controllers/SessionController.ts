import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
  async store(request: Request, response: Response) {
    const { email, password } = request.body;

    const userRepository = process.env.NODE_ENV === 'test'
      ? getConnection('test').getRepository(User)
      : getConnection('default').getRepository(User);

    const user = await userRepository.findOne({ where: { email }, });

    if (!user) {
      return response.status(401).json({ message: 'User not found.' });
    }

    const compareHash = await bcrypt.compare(password, user.password_hash);

    if (!compareHash) {
      return response.status(401).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign(user.id, '32a2c2aab06cbeac9ad4938808bda9d1');

    return response.status(200).json({ user, token });
  }
}

export default new SessionController();
