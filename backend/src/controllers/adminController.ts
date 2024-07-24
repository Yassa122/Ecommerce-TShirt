import { Request, Response } from 'express';
import admin from 'firebase-admin';

const db = admin.firestore();

export const addProduct = async (req: Request, res: Response) => {
  const { Images,ProductName, Price, Size, Type } = req.body;
  try {
    const productRef = await db.collection('products').add({
      Images,
      ProductName,
      Price,
      Size,
      Type
    });
    res.status(201).send(`Product added with ID: ${productRef.id}`);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

// export const getOrders = async (req: Request, res: Response) => {
//   try {
//     const ordersRef = db.collection('orders');
//     const snapshot = await ordersRef.get();
//     const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// export const respondToOrder = async (req: Request, res: Response) => {
//   const { orderId, responseMessage } = req.body;
//   try {
//     const orderRef = db.collection('orders').doc(orderId);
//     await orderRef.update({ responseMessage });
//     res.status(200).send(`Order responded to with ID: ${orderId}`);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };
