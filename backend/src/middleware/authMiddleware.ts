import { NextFunction, Request, Response } from 'express';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

const db = admin.firestore();

interface DecodedToken {
  id: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access Denied. No Token Provided.');
  }

  try {
    const decoded = jwt.decode(token) as DecodedToken;
    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }

    const userRef = db.collection('users').doc(decoded.id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    if (!userData) {
      throw new Error('User data not found');
    }

    jwt.verify(token, userData.secret);
    (req as any).user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid Token.');
  }
};