"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-zinc-900 dark:bg-gray-100 text-white dark:text-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold">T-Shirt Store</a>
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/" legacyBehavior>
            <a className="hover:text-blue-400 transition">Home</a>
          </Link>
          <Link href="#products" legacyBehavior>
            <a className="hover:text-blue-400 transition">Products</a>
          </Link>
          <Link href="#testimonials" legacyBehavior>
            <a className="hover:text-blue-400 transition">Testimonials</a>
          </Link>
          <Link href="#contact" legacyBehavior>
            <a className="hover:text-blue-400 transition">Contact</a>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded transition"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-2xl">
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <Link href="/" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-200">Home</a>
          </Link>
          <Link href="#products" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-200">Products</a>
          </Link>
          <Link href="#testimonials" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-200">Testimonials</a>
          </Link>
          <Link href="#contact" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-200">Contact</a>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="block bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded mx-auto my-4 transition"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
