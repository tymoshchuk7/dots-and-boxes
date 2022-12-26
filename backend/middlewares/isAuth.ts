import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export default function isAuth(
  req: express.Request, res: express.Response, next: express.NextFunction,
) {
  const { token } = req.body;
  jwt.verify(token, config.secret, (err: any, decode: any) => {
    if (err) {
      return res.status(401);
    }
    req.body.id = decode.data;
    req.body.playername = decode.name;
    return next();
  });
}
