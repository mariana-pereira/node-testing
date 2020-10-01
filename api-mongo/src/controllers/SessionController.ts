import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../config/auth.json';

class SessionController {
  async store(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user) {
      return response.status(400).json({ error: 'User not found.' });
    }

    if(!await bcrypt.compare(password, user.password)) {
      return response.status(400).json({ error: 'Invalid password.' });
    }

    user.password = undefined;

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400,
    });

    return response.status(200).json({ user, token });
  }
}

export default new SessionController();