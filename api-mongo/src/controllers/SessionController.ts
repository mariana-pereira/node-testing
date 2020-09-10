import { Request, Response } from 'express';

class SessionController {
  async store(request: Request, response: Response) {
    return response.status(200).send();
  }
}

export default new SessionController();