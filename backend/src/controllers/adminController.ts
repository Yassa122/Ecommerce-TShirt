import { Request, Response } from 'express';
import admin from 'firebase-admin';
import multer from 'multer';

const db = admin.firestore();
const storage = admin.storage().bucket();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

export const addProduct = async (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { ProductName, Price, Size, Type } = req.body;
    const file = req.file;
    const imageName = `${Date.now()}-${file.originalname}`;
    const fileUpload = storage.file(imageName);

    try {
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const fileUrl = `https://storage.googleapis.com/${storage.name}/${fileUpload.name}`;

      const productRef = await db.collection('products').add({
        Images: [fileUrl],
        ProductName,
        Price,
        Size,
        Type
      });

      res.status(201).send(`Product added with ID: ${productRef.id}`);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
};

// Function to get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
