"use client";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Carousel from "../components/carousel";
import Navbar from "../components/navbar";

const Home: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([
    { id: 1, text: "Best T-shirts ever!", author: "John Doe" },
    { id: 2, text: "Great quality and fast shipping!", author: "Jane Smith" },
    { id: 3, text: "I love the designs!", author: "Mike Johnson" },
  ]);

  useEffect(() => {
    // Fetch actual products from your API
    axios.get("http://localhost:3000/api/users/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          className="hero text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-bold mb-4">Discover Your Style</h1>
          <p className="text-xl mb-8">Shop the latest trends in T-shirts</p>
          <Link href="#products" legacyBehavior>
            <a className="bg-blue-500 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-400 dark:hover:bg-blue-600 transition">
              Shop Now
            </a>
          </Link>
        </motion.div>

        {/* Products Section */}
        <h2 id="products" className="text-4xl font-bold text-center my-8">Our Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="relative bg-zinc-900 dark:bg-white rounded-lg overflow-hidden shadow-2xl hover:shadow-2xl transition-shadow duration-300 drop-shadow-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-full flex items-center justify-center" style={{ height: '300px' }}>
                <img src={product.Images[0]} alt={product.ProductName} style={{ objectFit: 'cover' }} className="object-contain w-full h-full" />
              </div>
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-75 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="text-center text-white">
                  <h2 className="text-2xl font-bold mb-2">{product.ProductName}</h2>
                  <p className="text-lg mb-4">{product.Type}</p>
                  <Link href={`/product/${product.id}`} legacyBehavior>
                    <a className="text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-500 transition">View Product</a>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Section */}
        <Carousel />

        {/* Testimonials Section */}
        <h2 id="testimonials" className="text-4xl font-bold text-center my-8">What Our Customers Say</h2>
        <div className="testimonials grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-zinc-900 dark:bg-white rounded-lg p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 drop-shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: testimonial.id * 0.2 }}
            >
              <p className="text-lg mb-4 dark:text-black">"{testimonial.text}"</p>
              <h3 className="text-xl font-bold dark:text-black">- {testimonial.author}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
