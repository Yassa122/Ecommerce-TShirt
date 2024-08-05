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

// Function to get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).send('Product not found.');
    }

    res.status(200).json({ id: productDoc.id, ...productDoc.data() });
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

// Function to edit a product by ID
export const editProduct = async (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    const { id } = req.params;
    const { ProductName, Price, Type, Sizes } = req.body;

    try {
      const productRef = db.collection('products').doc(id);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).send('Product not found.');
      }

      let imageUrl;
      if (req.file) {
        const file = req.file;
        const imageName = `${Date.now()}-${file.originalname}`;
        const fileUpload = storage.file(imageName);

        await fileUpload.save(file.buffer, {
          metadata: {
            contentType: file.mimetype,
          },
        });

        imageUrl = `https://storage.googleapis.com/${storage.name}/${fileUpload.name}`;
      }

      // Parse Sizes if provided
      let parsedSizes;
      if (Sizes) {
        try {
          parsedSizes = JSON.parse(Sizes);
        } catch (parseError) {
          return res.status(400).send('Invalid Sizes format. Expected a JSON string.');
        }

        if (!Array.isArray(parsedSizes)) {
          return res.status(400).send('Sizes should be an array.');
        }
      }

      await productRef.update({
        ProductName,
        Price: parseFloat(Price),
        Type,
        ...(parsedSizes && { Sizes: parsedSizes }),
        ...(imageUrl && { Images: [imageUrl] }),
      });

      res.status(200).send('Product updated successfully.');
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
};

// Function to delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).send('Product not found.');
    }

    await productRef.delete();
    res.status(200).send('Product deleted successfully.');
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
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

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const productsSnapshot = await db.collection('Orders').get();
    const Orders = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(Orders);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
export const addPhoto = async (req: Request, res: Response) => {
  upload.array('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).send('No files uploaded.');
    }

    try {
      const fileUrls = await Promise.all(
        req.files.map(async (file: any) => {
          const imageName = `${Date.now()}-${file.originalname}`;
          const fileUpload = storage.file(imageName);
          await fileUpload.save(file.buffer, {
            metadata: {
              contentType: file.mimetype,
            },
          });
          return `https://storage.googleapis.com/${storage.name}/${fileUpload.name}`;
        })
      );

      const photoRefs = await Promise.all(
        fileUrls.map(async (url) => {
          const photoRef = await db.collection('gallery').add({
            url,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          return { id: photoRef.id, url };
        })
      );

      res.status(201).send(photoRefs);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
};
// Get All Photos
export const getAllPhotos = async (req: Request, res: Response) => {
  try {
    const photosSnapshot = await db.collection('gallery').get();
    const photos = photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(photos);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

// Delete Photo
export const deletePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const photoRef = db.collection('gallery').doc(id);
    const photoDoc = await photoRef.get();

    if (!photoDoc.exists) {
      return res.status(404).send('Photo not found.');
    }

    await photoRef.delete();
    res.status(200).send('Photo deleted successfully.');
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
  
};

