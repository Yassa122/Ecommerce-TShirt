import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

dotenv.config();
const db = admin.firestore();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    // Check if user already exists
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();
    
    if (!snapshot.empty) {
      return res.status(400).send('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user document
    const newUser = {
      email,
      password: hashedPassword
    };
    
    const userDocRef = await db.collection('users').add(newUser);
    
    // Generate JWT token
    const token = generateToken(userDocRef.id);
    res.status(201).send({ token });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();
    
    if (snapshot.empty) {
      return res.status(400).send('Invalid email or password');
    }
    
    const userData = snapshot.docs[0].data();
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, userData.password);
    
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }
    
    // Generate JWT token
    const token = generateToken(snapshot.docs[0].id);
    res.send({ token });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
