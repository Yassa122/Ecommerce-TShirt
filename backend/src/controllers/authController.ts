import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

const db = admin.firestore();

// Generate a JWT token using the user's unique secret
const generateToken = (id: string, secret: string) => {
  return jwt.sign({ id }, secret, { expiresIn: '1h' });
};

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      return res.status(400).send('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique secret for the user
    const userSecret = crypto.randomBytes(64).toString('hex');

    const newUser = {
      email,
      password: hashedPassword,
      secret: userSecret,
    };

    const userDocRef = await db.collection('users').add(newUser);

    const token = generateToken(userDocRef.id, userSecret);

    await userDocRef.update({ token });

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

    res.status(201).send({ token });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).send((error as Error).message);
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return res.status(400).send('Invalid credentials');
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = generateToken(userDoc.id, userData.secret);

    await userDoc.ref.update({ token });

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

    res.status(200).send({ token });
  } catch (error) {
    console.error('Error signing in user:', error);
    res.status(500).send((error as Error).message);
  }
};