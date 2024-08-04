"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePhoto = exports.getAllPhotos = exports.addPhoto = exports.getAllOrders = exports.getAllProducts = exports.deleteProduct = exports.editProduct = exports.getProductById = exports.addProduct = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const multer_1 = __importDefault(require("multer"));
const db = firebase_admin_1.default.firestore();
const storage = firebase_admin_1.default.storage().bucket();
// Configure multer for file upload
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload.single('image')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
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
            yield fileUpload.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype,
                },
            });
            const fileUrl = `https://storage.googleapis.com/${storage.name}/${fileUpload.name}`;
            // Parse Sizes from JSON string to an array of objects
            let parsedSizes;
            try {
                parsedSizes = JSON.parse(Sizes);
            }
            catch (parseError) {
                return res.status(400).send('Invalid Sizes format. Expected a JSON string.');
            }
            if (!Array.isArray(parsedSizes)) {
                return res.status(400).send('Sizes should be an array.');
            }
            const productRef = yield db.collection('products').add({
                Images: [fileUrl],
                ProductName,
                Price: parseFloat(Price),
                Sizes: parsedSizes,
                Type,
            });
            res.status(201).send(`Product added with ID: ${productRef.id}`);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }));
});
exports.addProduct = addProduct;
// Function to get a product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productRef = db.collection('products').doc(id);
        const productDoc = yield productRef.get();
        if (!productDoc.exists) {
            return res.status(404).send('Product not found.');
        }
        res.status(200).json(Object.assign({ id: productDoc.id }, productDoc.data()));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getProductById = getProductById;
// Function to edit a product by ID
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload.single('image')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(500).send(err.message);
        }
        const { id } = req.params;
        const { ProductName, Price, Type, Sizes } = req.body;
        try {
            const productRef = db.collection('products').doc(id);
            const productDoc = yield productRef.get();
            if (!productDoc.exists) {
                return res.status(404).send('Product not found.');
            }
            let imageUrl;
            if (req.file) {
                const file = req.file;
                const imageName = `${Date.now()}-${file.originalname}`;
                const fileUpload = storage.file(imageName);
                yield fileUpload.save(file.buffer, {
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
                }
                catch (parseError) {
                    return res.status(400).send('Invalid Sizes format. Expected a JSON string.');
                }
                if (!Array.isArray(parsedSizes)) {
                    return res.status(400).send('Sizes should be an array.');
                }
            }
            yield productRef.update(Object.assign(Object.assign({ ProductName, Price: parseFloat(Price), Type }, (parsedSizes && { Sizes: parsedSizes })), (imageUrl && { Images: [imageUrl] })));
            res.status(200).send('Product updated successfully.');
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }));
});
exports.editProduct = editProduct;
// Function to delete a product by ID
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productRef = db.collection('products').doc(id);
        const productDoc = yield productRef.get();
        if (!productDoc.exists) {
            return res.status(404).send('Product not found.');
        }
        yield productRef.delete();
        res.status(200).send('Product deleted successfully.');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.deleteProduct = deleteProduct;
// Function to get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsSnapshot = yield db.collection('products').get();
        const products = productsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getAllProducts = getAllProducts;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsSnapshot = yield db.collection('Orders').get();
        const Orders = productsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(Orders);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getAllOrders = getAllOrders;
const addPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    upload.array('image')(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!req.files || !Array.isArray(req.files)) {
            return res.status(400).send('No files uploaded.');
        }
        try {
            const fileUrls = yield Promise.all(req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const imageName = `${Date.now()}-${file.originalname}`;
                const fileUpload = storage.file(imageName);
                yield fileUpload.save(file.buffer, {
                    metadata: {
                        contentType: file.mimetype,
                    },
                });
                return `https://storage.googleapis.com/${storage.name}/${fileUpload.name}`;
            })));
            const photoRefs = yield Promise.all(fileUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
                const photoRef = yield db.collection('gallery').add({
                    url,
                    createdAt: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
                });
                return { id: photoRef.id, url };
            })));
            res.status(201).send(photoRefs);
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }));
});
exports.addPhoto = addPhoto;
// Get All Photos
const getAllPhotos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const photosSnapshot = yield db.collection('gallery').get();
        const photos = photosSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.status(200).json(photos);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.getAllPhotos = getAllPhotos;
// Delete Photo
const deletePhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const photoRef = db.collection('gallery').doc(id);
        const photoDoc = yield photoRef.get();
        if (!photoDoc.exists) {
            return res.status(404).send('Photo not found.');
        }
        yield photoRef.delete();
        res.status(200).send('Photo deleted successfully.');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.deletePhoto = deletePhoto;
