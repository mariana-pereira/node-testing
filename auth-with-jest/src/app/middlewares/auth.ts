import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if(!authHeader) {
    return res.status(401).json({ message: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  jwt.verify(token, '32a2c2aab06cbeac9ad4938808bda9d1', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token.' })
    }

    req.userId = decoded.id;

    return next();
  });
}
