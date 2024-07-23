"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const products = [
  { id: 1, name: 'Product 1', description: 'Description of Product 1', image: 't1.jpg' },
  { id: 2, name: 'Product 2', description: 'Description of Product 2', image: 't2.jpg' },
  { id: 3, name: 'Product 3', description: 'Description of Product 3', image: 't3.jpg' },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <AnimatePresence>
        {products.map((product, index) => (
          index === currentIndex && (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full"
            >
              <img src={product.image} alt={product.name} layout="fill" objectFit="cover" />
              <div className="absolute bottom-0 bg-black bg-opacity-50 w-full p-4 text-white">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-lg">{product.description}</p>
                <Link href={`/product/${product.id}`} legacyBehavior>
                  <a className="text-blue-500">View Product</a>
                </Link>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2"
      >
        Prev
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2"
      >
        Next
      </button>
    </div>
  );
};

export default Carousel;
