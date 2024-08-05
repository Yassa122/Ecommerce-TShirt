"use client";
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlusCircle, FaTrash } from 'react-icons/fa';

interface Size {
  size: string;
  quantity: number;
}

interface Product {
  id: string;
  ProductName: string;
  Type: string;
  Price: number;
  Images: string[];
  Sizes: Size[];
}

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [cartMessage, setCartMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [newSize, setNewSize] = useState<Size>({ size: '', quantity: 0 });
  const [newImage, setNewImage] = useState<File | null>(null);


const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/pages/signin');
    }
  }, [router]);

  useEffect(() => {
    const id = window.location.pathname.split('/').pop(); // Extracting ID from the URL

    if (id) {
      axios.get(`https://amaria-backend.vercel.app/api/users/products/${id}`)
        .then(response => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError('Error fetching product details');
          setLoading(false);
        });
    } else {
      setError('Product ID not found in URL');
      setLoading(false);
    }
  }, []);

  const handleInputChange = (field: keyof Product, value: string | number) => {
    if (product) {
      setProduct(prevProduct => ({
        ...prevProduct!,
        [field]: value,
      }));
    }
  };

  const handleSizeChange = (index: number, field: keyof Size, value: string | number) => {
    if (product) {
      const updatedSizes = product.Sizes.map((size, i) =>
        i === index ? { ...size, [field]: value } : size
      );
      setProduct(prevProduct => ({
        ...prevProduct!,
        Sizes: updatedSizes,
      }));
    }
  };

  const handleNewSizeChange = (field: keyof Size, value: string | number) => {
    setNewSize(prevSize => ({
      ...prevSize,
      [field]: value,
    }));
  };

  const addNewSize = () => {
    if (newSize.size && newSize.quantity) {
      setProduct(prevProduct => ({
        ...prevProduct!,
        Sizes: [...(prevProduct!.Sizes || []), newSize],
      }));
      setNewSize({ size: '', quantity: 0 });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const addToCart = () => {
    if (selectedSize) {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const newItem = {
        id: product!.id,
        ProductName: product!.ProductName,
        Quantity: 1,
        TotalPrice: product!.Price,
        Images: product!.Images,
        selectedSize,
      };
      cartItems.push(newItem);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      setCartMessage("Product added to cart!");
    } else {
      setCartMessage("Please select a size.");
    }
  };

  const toggleEditing = () => {
    if (editing) {
      handleSave();
    } else {
      setEditing(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://amaria-backend.vercel.app/api/admin/deleteProduct/${id}`);
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('ProductName', product!.ProductName);
    formData.append('Type', product!.Type);
    formData.append('Price', product!.Price.toString());
    formData.append('Sizes', JSON.stringify(product!.Sizes));
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      await axios.put(`https://amaria-backend.vercel.app/api/admin/editProduct/${product!.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Product updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className={`${darkMode ? "dark" : ""} flex min-h-screen`}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 p-4 sm:p-8 bg-gray-100 dark:bg-black transition-all duration-300 ease-in-out">
        <div className="container mx-auto">
          {product ? (
            <div className="flex flex-col lg:flex-row items-start space-y-8 lg:space-y-0 lg:space-x-12">
              <motion.img 
                src={product.Images[0]} 
                alt={product.ProductName} 
                className="w-full lg:w-1/2 rounded-lg shadow-xl object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="w-full lg:w-1/2 dark:bg-zinc-900 bg-gray-50 dark:text-white text-black p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  {editing ? (
                    <input
                      type="text"
                      value={product.ProductName}
                      onChange={(e) => handleInputChange('ProductName', e.target.value)}
                      className="bg-transparent text-lg text-gray-800 dark:text-white border-b border-blue-500 focus:outline-none focus:border-blue-600 focus:ring-0 w-full"
                    />
                  ) : (
                    product.ProductName
                  )}
                </h1>
                <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-6">
                  {editing ? (
                    <input
                      type="text"
                      value={product.Type}
                      onChange={(e) => handleInputChange('Type', e.target.value)}
                      className="bg-transparent text-lg text-gray-800 dark:text-white border-b border-blue-500 focus:outline-none focus:border-blue-600 focus:ring-0 w-full"
                    />
                  ) : (
                    product.Type
                  )}
                </p>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-4">
                  {editing ? (
                    <input
                      type="number"
                      value={product.Price}
                      onChange={(e) => handleInputChange('Price', e.target.value)}
                      className="bg-transparent text-lg text-gray-800 dark:text-white border-b border-blue-500 focus:outline-none focus:border-blue-600 focus:ring-0 w-full"
                    />
                  ) : (
                    `$${product.Price}`
                  )}
                </p>
                <div className="mb-6">
                  <p className="font-medium text-lg mb-2">Sizes and Quantities:</p>
                  <ul className="space-y-2">
                    {product.Sizes && product.Sizes.map((sizeObj, index) => (
                      <li key={index} className="flex items-center space-x-4">
                        <div className="flex-1">
                          <span className="block font-medium text-sm text-gray-600 dark:text-gray-400">Size:</span>
                          <input
                            type="text"
                            value={sizeObj.size}
                            onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                            className={`bg-transparent text-lg text-gray-800 dark:text-white border-b ${
                              editing ? "border-blue-500 focus:outline-none focus:border-blue-600" : "border-transparent"
                            } focus:ring-0 w-full`}
                            disabled={!editing}
                          />
                        </div>
                        <div className="flex-1">
                          <span className="block font-medium text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
                          <input
                            type="number"
                            value={sizeObj.quantity}
                            onChange={(e) => handleSizeChange(index, 'quantity', e.target.value)}
                            className={`bg-transparent text-lg text-gray-800 dark:text-white border-b ${
                              editing ? "border-blue-500 focus:outline-none focus:border-blue-600" : "border-transparent"
                            } focus:ring-0 w-full`}
                            disabled={!editing}
                          />
                        </div>
                      </li>
                    ))}
                    {editing && (
                      <li className="flex items-center space-x-4">
                        <div className="flex-1">
                          <span className="block font-medium text-sm text-gray-600 dark:text-gray-400">New Size:</span>
                          <input
                            type="text"
                            value={newSize.size}
                            onChange={(e) => handleNewSizeChange('size', e.target.value)}
                            className="bg-transparent text-lg text-gray-800 dark:text-white border-b border-blue-500 focus:outline-none focus:border-blue-600 focus:ring-0 w-full"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="block font-medium text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
                          <input
                            type="number"
                            value={newSize.quantity}
                            onChange={(e) => handleNewSizeChange('quantity', e.target.value)}
                            className="bg-transparent text-lg text-gray-800 dark:text-white border-b border-blue-500 focus:outline-none focus:border-blue-600 focus:ring-0 w-full"
                          />
                        </div>
                        <div className="flex items-center">
                          <FaPlusCircle className="text-green-500 cursor-pointer" size={24} onClick={addNewSize} />
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="mb-6">
                  <p className="font-medium text-lg mb-2">Change Image:</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    onClick={(e) => { e.stopPropagation(); toggleEditing(); }}
                  >
                    <FaEdit className="inline-block mr-2" />
                    {editing ? 'Save' : 'Edit'}
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                    onClick={(e) => { e.stopPropagation(); handleDelete(product!.id); }}
                  >
                    <FaTrash className="inline-block mr-2" />
                    Delete
                  </button>
                </div>
                {cartMessage && <div className="mt-4 text-green-500">{cartMessage}</div>}
              </div>
            </div>
          ) : (
            <div className="text-center">No product found</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
