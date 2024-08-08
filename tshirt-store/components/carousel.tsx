"use client";
import { AnimatePresence, motion } from 'framer-motion';
import Link from "next/link";
import { useEffect, useState } from 'react';

interface CarouselSlide {
  image: string;
  title: string;
  buttonText: string;
  buttonLink: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ slides, autoPlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
      return () => clearInterval(interval); // Clean up the interval on unmount
    }
  }, [autoPlay]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence>
        {slides.map((slide, index) => (
          index === currentIndex && (
            <motion.div
              key={slide.image}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full"
            >
              <img src={slide.image} alt={`Slide Image ${index}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4 text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 50 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -50 }} 
                  transition={{ duration: 0.5 }} 
                  className="text-white text-4xl md:text-6xl font-bold font-pacifico"
                >
                  {slide.title}
                </motion.h2>
                <Link href={slide.buttonLink} legacyBehavior>
                  <motion.a 
                    initial={{ opacity: 0, y: 50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -50 }} 
                    transition={{ duration: 0.5, delay: 0.4 }} 
                    className="mt-4 bg-customGray text-white px-6 py-3 rounded-full hover:bg-gray-600 transition"
                  >
                    {slide.buttonText}
                  </motion.a>
                </Link>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full"
      >
        &lt;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-4 rounded-full"
      >
        &gt;
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-500'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
