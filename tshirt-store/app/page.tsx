"use client";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Carousel from "../components/carousel";
import Navbar from "../components/navbar";

const Home: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [galleryImages, setGalleryImages] = useState([
    // Add your gallery images URLs here
    "https://via.placeholder.com/800x400", // Example image
    "https://via.placeholder.com/800x400", // Example image
    "https://via.placeholder.com/800x400", // Example image
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
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 flex-grow">
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

        {/* Carousel Section */}
        <div className="my-8">
          <Carousel images={galleryImages} autoPlay={true} />
        </div>

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
                  <p className="text-lg font-bold">${typeof product.Price === 'number' ? product.Price.toFixed(2) : "N/A"}</p>
                  <Link href={`/product/${product.id}`} legacyBehavior>
                    <a className="text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-500 transition">View Product</a>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-zinc-900 dark:bg-gray-800 text-white dark:text-gray-300 py-8 mt-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">T-Shirt Store</h3>
            <p>Discover your style with our exclusive collection of T-shirts. Quality and comfort at its best.</p>
          </div>
          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li><Link href="#home" legacyBehavior><a className="hover:underline">Home</a></Link></li>
              <li><Link href="#products" legacyBehavior><a className="hover:underline">Products</a></Link></li>
              <li><Link href="#about" legacyBehavior><a className="hover:underline">About Us</a></Link></li>
              <li><Link href="#contact" legacyBehavior><a className="hover:underline">Contact</a></Link></li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p>Email: contact@tshirtstore.com</p>
            <p>Phone: +123 456 7890</p>
            <p>Address: 123 Fashion St, City, Country</p>
            {/* Social Media Links */}
            <div className="mt-4">
              <h4 className="text-lg font-bold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-400 hover:text-blue-600"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-blue-400 hover:text-blue-600"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-blue-400 hover:text-blue-600"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-blue-400 hover:text-blue-600"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center border-t border-gray-700 pt-4">
          <p>&copy; 2024 T-Shirt Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
