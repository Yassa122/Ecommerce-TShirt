import { Request, Response } from 'express';
import admin from 'firebase-admin';

const db = admin.firestore();

export const getProducts = async (req: Request, res: Response) => {
  console.log('Received request to get products');
  try {
    const productsRef = db.collection('Product'); // Ensure the collection name matches exactly
    const snapshot = await productsRef.get();
    console.log('Fetched products from Firestore:', snapshot.docs.map(doc => doc.data()));
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send((error as Error).message);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const productDoc = db.collection('Product').doc(id); // Ensure the collection name matches exactly
    const product = await productDoc.get();
    if (!product.exists) {
      res.status(404).send('Product not found');
    } else {
      res.status(200).json({ id: product.id, ...product.data() });
    }
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const { ProductName, ProductId, Quantity, TotalPrice } = req.body;
  try {
    const cartRef = db.collection('Cart').doc(); // Ensure this matches your Firestore collection name
    await cartRef.set({
      ProductName,
      ProductId,
      Quantity,
      TotalPrice,
      addedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).send(`Product added to cart with ID: ${cartRef.id}`);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
