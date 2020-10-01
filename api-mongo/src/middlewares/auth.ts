import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';

export default (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'No token provided.' });
  }

  const parts = authHeader.split(' ');

  if (!(parts.length === 2)) {
    return response.status(401).json({ error: 'Token error.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return response.status(401).json({ error: 'Malformatted token.' });
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return response.status(401).json({ error: 'Invalid token.' });
    }

    request.userId = decoded.id;

    return next();
  });
}