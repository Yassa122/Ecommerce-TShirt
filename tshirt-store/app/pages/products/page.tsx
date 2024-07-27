// pages/products.tsx
"use client";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar"; // Ensure the path is correct
import Footer from "@/components/footer";

interface Product {
  id: number;
  ProductName: string;
  Type: string;
  Price: number;
  Images: string[];
  Sizes: { size: string, quantity: number }[]; // Update Sizes property to an array of objects
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch products from the API
    axios.get("http://localhost:3000/api/users/products")
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const filteredProducts = products.filter(product =>
    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (id: number) => {
    router.push(`/pages/product/${id}`);
  };

  return (
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Our Products
        </motion.h1>
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <motion.div
                key={product.id}
                className="bg-zinc-900 dark:bg-white shadow-lg rounded-lg text-white dark:text-black cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.Images[0]}
                  alt={product.ProductName}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="mt-4 p-6">
                  <h2 className="text-2xl font-semibold">{product.ProductName}</h2>
                  <p className="mt-2 text-gray-400 dark:text-gray-700">{product.Type}</p>
                  <p className="mt-2 text-lg font-bold">${product.Price.toFixed(2)}</p>
                  <div className="mt-2">
                    <strong>Sizes:</strong>
                    <div className="flex flex-wrap mt-1">
                      {product.Sizes.map((sizeObj, index) => (
                        <span
                          key={index}
                          className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-2 py-1 rounded-md mr-2 mb-2"
                        >
                          {sizeObj.size} ({sizeObj.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              No products found.
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer/>

    </div>
  );
};

export default ProductPage;
