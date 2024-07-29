// pages/productsList.tsx
"use client";
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiMenuAlt1 } from 'react-icons/hi'; // Importing an icon for the sidebar toggle button
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
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);

  useEffect(() => {
    // Fetch products from the API
    axios.get('${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/getAllProducts')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditProduct({ ...products[index] });
  };

  const handleSave = () => {
    // Save the edited product (you can also send this data to the server)
    if (editProduct !== null && editIndex !== null) {
      const updatedProducts = [...products];
      updatedProducts[editIndex] = editProduct;
      setProducts(updatedProducts);
      setEditIndex(null);
      setEditProduct(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editProduct !== null) {
      setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
    }
  };

  const toggleAddProductModal = () => {
    setShowAddProductModal(!showAddProductModal);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
            <div className="mt-3 md:mt-0">
              <button
                onClick={toggleAddProductModal}
                className="inline-block px-4 py-2 text-white font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500"
              >
                Add Product
              </button>
            </div>
          </div>

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
                {products.map((product, idx) => (
                  <tr key={product.id} className={`hover:bg-neutral-100 dark:hover:bg-neutral-700 transition ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                    <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                      <img src={product.Images[0]} alt={product.ProductName} className="w-12 h-12 object-cover rounded-full" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                      {editIndex === idx ? (
                        <input
                          type="text"
                          name="ProductName"
                          value={editProduct?.ProductName || ''}
                          onChange={handleChange}
                          className={`border rounded-lg p-2 w-full ${darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-white text-black'}`}
                        />
                      ) : (
                        product.ProductName
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                      {editIndex === idx ? (
                        <input
                          type="text"
                          name="Price"
                          value={editProduct?.Price || ''}
                          onChange={handleChange}
                          className={`border rounded-lg p-2 w-full ${darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-white text-black'}`}
                        />
                      ) : (
                        `$${product.Price}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                      {editIndex === idx ? (
                        <input
                          type="text"
                          name="Type"
                          value={editProduct?.Type || ''}
                          onChange={handleChange}
                          className={`border rounded-lg p-2 w-full ${darkMode ? 'bg-neutral-800 text-neutral-300' : 'bg-white text-black'}`}
                        />
                      ) : (
                        product.Type
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap overflow-ellipsis overflow-hidden">
                      {product.Sizes.map(size => (
                        <span key={size.size} className="block">
                          {size.size}: {size.quantity}
                        </span>
                      ))}
                    </td>
                    <td className="text-right px-6 whitespace-nowrap">
                      {editIndex === idx ? (
                        <button
                          onClick={handleSave}
                          className="py-2 px-4 font-medium text-green-500 hover:text-green-400"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(idx)}
                          className="py-2 px-4 font-medium text-indigo-500 hover:text-indigo-400"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Product Modal */}
          {showAddProductModal && (
            <motion.div 
              className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative`}
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
        </div>
      </main>
    </div>
  );
};

export default ProductList;
