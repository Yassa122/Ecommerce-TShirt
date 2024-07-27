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

    const { ProductName, Price, Type, Sizes } = req.body;
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

      // Parse Sizes from JSON string to an array of objects
      let parsedSizes;
      try {
        parsedSizes = JSON.parse(Sizes);
      } catch (parseError) {
        return res.status(400).send('Invalid Sizes format. Expected a JSON string.');
      }

      if (!Array.isArray(parsedSizes)) {
        return res.status(400).send('Sizes should be an array.');
      }

      const productRef = await db.collection('products').add({
        Images: [fileUrl],
        ProductName,
        Price: parseFloat(Price),
        Sizes: parsedSizes,
        Type,
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
