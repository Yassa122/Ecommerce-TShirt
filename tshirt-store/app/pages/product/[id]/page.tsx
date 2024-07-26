// pages/product/[id].tsx
"use client";
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../../components/navbar';

const ProductDetail: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/users/products/${id}`)
        .then(response => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching product details:', error);
          setError('Error fetching product details');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const addToCart = () => {
    if (selectedSize) {
      setCartMessage("Product added to cart!");
    } else {
      setCartMessage("Please select a size.");
    }
  };

  
  return (
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-800">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg mb-4">{product.description}</p>
            <p className="text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Available Sizes:</h3>
              <div className="flex space-x-4">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 border rounded ${selectedSize === size ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p>No sizes available</p>
                )}
              </div>
            </div>
            <button
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={addToCart}
            >
              Add to Cart
            </button>
            {cartMessage && <p className="mt-4 text-red-500">{cartMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
