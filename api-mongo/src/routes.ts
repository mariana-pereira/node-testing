import express from 'express';

import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';
import ProjectController from './controllers/ProjectController';

import authMiddleware from './middlewares/auth';

const routes = express.Router();

routes.post('/sessions', SessionController.store);

routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.get('/projects', ProjectController.index);

export default routes;