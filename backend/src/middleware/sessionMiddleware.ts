import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const generateSessionID = (req: Request, res: Response, next: NextFunction) => {
  let sessionID = req.cookies.sessionID;
  if (!sessionID) {
    sessionID = uuidv4();
    res.cookie('sessionID', sessionID, { httpOnly: true });
  }
  (req as any).sessionID = sessionID;
  next();
}