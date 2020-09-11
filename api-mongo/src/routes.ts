import express from 'express';

import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';

const routes = express.Router();

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

export default routes;