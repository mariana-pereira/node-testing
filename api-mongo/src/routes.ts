import express from 'express';

import SessionController from './controllers/SessionController';

const routes = express.Router();

routes.post('/sessions', SessionController.store);

export default routes;