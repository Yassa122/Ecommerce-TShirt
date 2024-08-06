"use client";
import Footer from "@/components/footer";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Carousel from "../components/carousel";
import Navbar from "../components/navbar";

// Define the Product type
interface Product {
  id: string;
  ProductName: string;
  Price: number;
  Type: string;
  Images: string[];
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    // Fetch actual products from your API
    axios.get("https://amaria-backend.vercel.app/api/users/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    // Fetch gallery images from your API
    axios.get("https://amaria-backend.vercel.app/api/admin/getAllPhotos")
      .then((response) => {
        setGalleryImages(response.data.map((photo: { url: string }) => photo.url));
      })
      .catch((error) => {
        console.error("Error fetching gallery images:", error);
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
          <h1 className="text-6xl font-bold mb-4">It girl essentials</h1>
          <p className="text-xl mb-8">Shop the latest trends</p>
          <Link href="/pages/products" legacyBehavior>
            <a className="bg-blue-500 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-400 dark:hover:bg-blue-600 transition">
              Shop Now
            </a>
          </Link>
        </motion.div>

        {/* Carousel Section */}
        <div className="my-8">
          <Carousel images={galleryImages} autoPlay={true} />
        </div>

        {/* Featured Products Section */}
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
                  <Link href={`/pages/product/${product.id}`} legacyBehavior>
                    <a className="text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-500 transition">View Product</a>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* About Us Section */}
        <motion.div
          className="about-us bg-zinc-900 dark:bg-white text-white dark:text-black py-16 px-4 text-center rounded-lg shadow-2xl my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-8">We are committed to providing the best products for fashion-forward individuals. Our mission is to bring you the latest trends and essentials for your wardrobe.</p>
          <Link href="/pages/about" legacyBehavior>
            <a className="bg-blue-500 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-400 dark:hover:bg-blue-600 transition">
              Learn More
            </a>
          </Link>
        </motion.div>


      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Home;
