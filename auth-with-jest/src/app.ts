import * as dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

import './database';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : 'env'
});

class AppController {
  public express: express.Application;

  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes);
  }
}

export default new AppController().express;
