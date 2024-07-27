"use client";
import Footer from '@/components/footer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../../../../components/navbar';

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

  useEffect(() => {
    const id = window.location.pathname.split('/').pop(); // Extracting ID from the URL

    if (id) {
      console.log(`Fetching product details for ID: ${id}`);
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
    } else {
      setError('Product ID not found in URL');
      setLoading(false);
    }
  }, []);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            {product && product.Images && (
              <img src={product.Images[0]} alt={product.ProductName} className="w-full h-full object-contain rounded-lg" />
            )}
          </div>

          <div>
            {product ? (
              <>
                <h1 className="text-4xl font-bold mb-4">{product.ProductName}</h1>
                <p className="text-lg mb-4">{product.Type}</p>
                <p className="text-xl font-bold mb-4">${product.Price.toFixed(2)}</p>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Available Sizes:</h3>
                  <div className="flex flex-wrap gap-4">
                    {product.Sizes && product.Sizes.length > 0 ? (
                      product.Sizes.map((sizeObj: Size, index) => (
                        <button
                          key={index}
                          className={`px-4 py-2 border rounded-lg ${selectedSize === sizeObj.size ? 'bg-blue-500 text-white' : 'dark:bg-gray-300 bg-zinc-700'}`}
                          onClick={() => handleSizeChange(sizeObj.size)}
                        >
                          {sizeObj.size} ({sizeObj.quantity})
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
              </>
            ) : (
              <p>Product not found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
