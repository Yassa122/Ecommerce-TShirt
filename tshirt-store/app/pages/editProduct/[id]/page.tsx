"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const id = window.location.pathname.split('/').pop(); // Extracting ID from the URL

    if (id) {
      axios.get(``${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/products/${id}`)
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
    setEditing(!editing);
  };

  const handleDelete = (id: string) => {
    // Implement your logic for handling delete
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
      <main className="flex-1 p-8 bg-gray-100 dark:bg-black transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 py-8">
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
                <h1 className="text-4xl font-bold mb-4">
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
                <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">
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
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
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
                  </ul>
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
                    onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
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
