import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

export function requestContextMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.headers['x-request-id'] ||= uuid();
  next();
}
