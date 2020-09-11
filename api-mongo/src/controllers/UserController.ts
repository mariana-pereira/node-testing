import User from '../models/User';

import { Request, Response } from 'express';

class UserController {
  async store(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const user = await User.findOne({ email });

    if (user) return response.status(400).send();

    await User.create({
      name,
      email,
      password
    });

    return response.status(200).send();
  }
}

export default new UserController();