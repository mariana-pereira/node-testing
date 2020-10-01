import { Request, Response } from 'express';

class ProjectController {
  async index(request: Request, response: Response) {
    

    return response.status(200).send();
  }
}

export default new ProjectController();