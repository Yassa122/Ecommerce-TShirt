"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import Carousel from '../components/Carousel';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  const products = [
    { id: 1, name: 'Product 1', description: 'Description of Product 1', image: 't1.jpg' },
    { id: 2, name: 'Product 2', description: 'Description of Product 2', image: 't2.jpg' },
    { id: 3, name: 'Product 3', description: 'Description of Product 3', image: 't3.jpg' },
  ];

  const testimonials = [
    { id: 1, text: "Best T-shirts ever!", author: "John Doe" },
    { id: 2, text: "Great quality and fast shipping!", author: "Jane Smith" },
    { id: 3, text: "I love the designs!", author: "Mike Johnson" },
  ];

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
              className="bg-zinc-900 dark:bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-lg mb-4">{product.description}</p>
                <Link href={`/product/${product.id}`} legacyBehavior>
                  <a className="text-blue-400 dark:text-blue-600 hover:text-blue-300 dark:hover:text-blue-500 transition">View Product</a>
                </Link>
              </div>
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
              className="bg-zinc-900 dark:bg-white rounded-lg p-6 shadow-lg"
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
