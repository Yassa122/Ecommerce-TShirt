"use client";
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaTh, FaThList } from 'react-icons/fa';
import { HiMenuAlt1 } from 'react-icons/hi';
import Sidebar from '../../../components/sidebar';
import AddProduct from '../addProduct/page';

interface Size {
  size: string;
  quantity: number;
}

interface Product {
  id: string;
  ProductName: string;
  Price: number;
  Type: string;
  Images: string[];
  Sizes: Size[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [showEditProductModal, setShowEditProductModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  useEffect(() => {
    axios.get('https://amaria-backend.vercel.app/api/admin/getAllProducts')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowEditProductModal(true);
  };
  const handleImageUpload = (file: File, imageIndex: number) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (editProduct) {
        const updatedImages = [...editProduct.Images];
        updatedImages[imageIndex] = reader.result as string; // Update with base64 data or URL
        setEditProduct({ ...editProduct, Images: updatedImages });
      }
    };
    reader.readAsDataURL(file); // Convert to base64
  };

  const handleSave = () => {
    if (editProduct !== null) {
      axios.put(`https://amaria-backend.vercel.app/api/admin/editProduct/${editProduct.id}`, editProduct)
        .then(response => {
          setProducts(products.map(product => 
            product.id === editProduct.id ? editProduct : product
          ));
          setShowEditProductModal(false);
          setEditProduct(null);
        })
        .catch(error => console.error("Error updating product:", error));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    if (editProduct !== null) {
      const { name, value } = e.target;
      if (name === "quantity" && index !== undefined) {
        const updatedSizes = [...editProduct.Sizes];
        updatedSizes[index] = { ...updatedSizes[index], quantity: parseInt(value, 10) };
        setEditProduct({ ...editProduct, Sizes: updatedSizes });
      } else if (name === "size" && index !== undefined) {
        const updatedSizes = [...editProduct.Sizes];
        updatedSizes[index] = { ...updatedSizes[index], size: value };
        setEditProduct({ ...editProduct, Sizes: updatedSizes });
      } else if (name === "Images") {
        const updatedImages = [...editProduct.Images];
        updatedImages[index ?? 0] = value;
        setEditProduct({ ...editProduct, Images: updatedImages });
      } else {
        setEditProduct({ ...editProduct, [name]: value });
      }
    }
  };

  const handleDelete = (id: string) => {
    axios.delete(`https://amaria-backend.vercel.app/api/admin/deleteProduct/${id}`)
      .then(response => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch(error => console.error("Error deleting product:", error));
  };

  const toggleAddProductModal = () => {
    setShowAddProductModal(!showAddProductModal);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'card' : 'table');
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 p-8 relative">
        <div className="absolute top-4 left-4 md:hidden">
          <button 
            onClick={toggleSidebar} 
            className="text-white bg-blue-600 p-2 rounded-full shadow-lg focus:outline-none"
          >
            <HiMenuAlt1 size={24} />
          </button>
        </div>
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start justify-between mt-8">
            <div className="max-w-lg">
              <h3 className="text-2xl font-bold">
                Products
              </h3>
              <p className="mt-2">
                Manage your products.
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex items-center space-x-4">
              <button
                onClick={toggleViewMode}
                className="inline-block px-4 py-2 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500"
              >
                {viewMode === 'table' ? <FaTh size={20} /> : <FaThList size={20} />}
              </button>
              <button
                onClick={toggleAddProductModal}
                className="inline-block px-4 py-2 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500"
              >
                Add Product
              </button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="mt-12 shadow-md border rounded-lg overflow-x-auto">
              <table className={`min-w-full table-auto text-sm text-left ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                <thead className={`font-medium border-b ${darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-700'}`}>
                  <tr>
                    <th className="py-3 px-6">Product Image</th>
                    <th className="py-3 px-6">Product Name</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6">Type</th>
                    <th className="py-3 px-6">Sizes</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-neutral-700' : 'divide-neutral-200'}`}>
                  {products.map((product) => (
                    <tr key={product.id} className={`hover:bg-neutral-100 dark:hover:bg-neutral-700 transition ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                      <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                        <img src={product.Images[0]} alt={product.ProductName} className="w-12 h-12 object-cover rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {product.ProductName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {`$${product.Price}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {product.Type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {product.Sizes.map(size => (
                          <span key={size.size} className="block">
                            {size.size}: {size.quantity}
                          </span>
                        ))}
                      </td>
                      <td className="text-right px-6 whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="py-2 px-4 font-medium text-indigo-500 hover:text-indigo-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="py-2 px-4 font-medium text-red-500 hover:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={product.Images[0]} alt={product.ProductName} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h4 className="text-lg font-semibold mb-2">{product.ProductName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Type: {product.Type}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Price: ${product.Price}</p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Sizes and Quantities:</p>
                    <ul className="list-disc pl-5">
                      {product.Sizes.map(size => (
                        <li key={size.size}>
                          {size.size}: {size.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      className="text-blue-500 hover:underline font-bold"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline font-bold"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {showAddProductModal && (
            <motion.div 
              className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4`}
                initial={{ y: '-100vh' }}
                animate={{ y: 0 }}
                exit={{ y: '-100vh' }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 dark:text-gray-400"
                  onClick={toggleAddProductModal}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
                <AddProduct />
              </motion.div>
            </motion.div>
          )}

{showEditProductModal && (
  <motion.div 
    className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="bg-neutral-800 p-6 rounded-lg shadow-lg relative w-full max-w-md mx-4"
      initial={{ y: '-100vh' }}
      animate={{ y: 0 }}
      exit={{ y: '-100vh' }}
    >
      <button
        className="absolute top-4 right-4 text-gray-400"
        onClick={() => setShowEditProductModal(false)}
      >
        &times;
      </button>
      <h2 className="text-2xl font-semibold mb-4 text-white">Edit Product</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="ProductName"
          value={editProduct?.ProductName || ''}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full text-white bg-neutral-800 border-gray-600 placeholder-gray-400"
          placeholder="Product Name"
        />
        <input
          type="number"
          name="Price"
          value={editProduct?.Price || 0}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full text-white bg-neutral-800 border-gray-600 placeholder-gray-400"
          placeholder="Price"
        />
        <input
          type="text"
          name="Type"
          value={editProduct?.Type || ''}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full text-white bg-neutral-800 border-gray-600 placeholder-gray-400"
          placeholder="Type"
        />
        <div>
          {editProduct?.Sizes.map((size, sizeIndex) => (
            <div key={sizeIndex} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                name="size"
                value={size.size}
                onChange={(e) => handleChange(e, sizeIndex)}
                className="p-2 w-full sm:w-1/2 border rounded-lg text-white bg-neutral-800 border-gray-600 placeholder-gray-400"
                placeholder="Size"
              />
              <input
                type="number"
                name="quantity"
                value={size.quantity}
                onChange={(e) => handleChange(e, sizeIndex)}
                className="p-2 w-full sm:w-1/2 border rounded-lg text-white bg-neutral-800 border-gray-600 placeholder-gray-400"
                placeholder="Quantity"
              />
            </div>
          ))}
        </div>
        <div>
  {editProduct?.Images.map((image, imageIndex) => (
    <div key={imageIndex} className="flex items-center gap-2 mb-2">
      <input
        type="text"
        name="Images"
        value={image}
        onChange={(e) => handleChange(e, imageIndex)}
        className="border rounded-lg p-2 w-full text-white bg-neutral-800 border-gray-600 placeholder-gray-400"
        placeholder="Image URL"
      />
      <button
        className="text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4"
        onClick={() => {
          const fileInput = document.getElementById(`imageUpload-${imageIndex}`);
          if (fileInput) {
            fileInput.click();
          }
        }}
      >
        Select Image
      </button>
      <input
        type="file"
        id={`imageUpload-${imageIndex}`}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file, imageIndex);
          }
        }}
      />
    </div>
  ))}
</div>
<div>
  {editProduct?.Images.map((image, imageIndex) => (
    <div key={imageIndex} className="flex items-center gap-2 mb-2">
      <input
        type="text"
        name="Images"
        value={image}
        onChange={(e) => handleChange(e, imageIndex)}
        className="border rounded-lg p-2 w-full text-white bg-neutral-800 border-gray-600 placeholder-gray-400"
        placeholder="Image URL"
      />
      <button
        className="text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4"
        onClick={() => {
          const fileInput = document.getElementById(`imageUpload-${imageIndex}`);
          if (fileInput) {
            fileInput.click();
          }
        }}
      >
        Select Image
      </button>
      <input
        type="file"
        id={`imageUpload-${imageIndex}`}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImageUpload(file, imageIndex);
          }
        }}
      />
    </div>
  ))}
</div>

        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={handleSave}
            className="text-green-500 hover:text-green-400 font-bold py-2 px-4 bg-green-100 rounded-lg"
          >
            Save
          </button>
          <button
            onClick={() => setShowEditProductModal(false)}
            className="text-red-500 hover:text-red-400 font-bold py-2 px-4 bg-red-100 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}





        </div>
      </main>
    </div>
  );
};

export default ProductList;
