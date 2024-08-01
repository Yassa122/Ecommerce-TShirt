import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { sendOrderConfirmationEmail } from '../config/mailer';

const db = admin.firestore();
const storage = admin.storage().bucket();

// Function to get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const productsSnapshot = await db.collection('products').get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

// Function to get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const productDoc = await db.collection('products').doc(id).get(); // Ensure the collection name matches exactly
    if (!productDoc.exists) {
      res.status(404).send('Product not found');
    } else {
      res.status(200).json({ id: productDoc.id, ...productDoc.data() });
    }
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

// Function to add a product to the cart
export const addToCart = async (req: Request, res: Response) => {
  const { ProductName, ProductId, Quantity, TotalPrice } = req.body;
  const sessionID = (req as any).sessionID;

  if (!sessionID) {
    return res.status(400).send('Session ID is required.');
  }

  try {
    const cartRef = db.collection('Cart').doc(); // Ensure this matches your Firestore collection name
    await cartRef.set({
      sessionID,
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

// Function to get all items in the cart for a session
export const getCartItems = async (req: Request, res: Response) => {
  const sessionID = (req as any).sessionID;

  if (!sessionID) {
    return res.status(400).send('Session ID is required.');
  }

  try {
    const cartRef = db.collection('Cart').where('sessionID', '==', sessionID);
    const snapshot = await cartRef.get();
    const cartItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

// Function to handle checkout and order creation
export const checkout = async (req: Request, res: Response) => {
  const { cartItems, shippingInfo, deliveryFee } = req.body;

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).send('Cart items are required.');
  }

  try {
    // Create a batch to perform all the operations atomically
    const batch = db.batch();

    // Process each cart item
    const orderDetails = cartItems.map(item => {
      const orderRef = db.collection('Orders').doc();
      batch.set(orderRef, {
        ProductName: item.ProductName,
        ProductId: item.id,
        Quantity: item.Quantity,
        TotalPrice: item.TotalPrice,
        Images: item.Images,
        selectedSize: item.selectedSize,
        orderId: orderRef.id,
        status: 'Pending',
        orderedAt: admin.firestore.FieldValue.serverTimestamp(),
        deliveryFee // Include delivery fee
      });
      return {
        ProductName: item.ProductName,
        ProductId: item.id,
        Quantity: item.Quantity,
        TotalPrice: item.TotalPrice,
        selectedSize: item.selectedSize,
      };
    });

    // Commit the batch
    await batch.commit();

    // Send confirmation email
    sendOrderConfirmationEmail(shippingInfo.email, orderDetails);

    res.status(201).send('Checkout successful, orders placed.');
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
