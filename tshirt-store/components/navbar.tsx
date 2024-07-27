
// components/Navbar.tsx
"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
        <div className="hidden md:flex space-x-4 items-center">
          <Link href="/" legacyBehavior>
            <a className="hover:text-blue-400 transition">Home</a>
          </Link>
          <Link href="/pages/products" legacyBehavior>
            <a className="hover:text-blue-400 transition">Products</a>
          </Link>
          <Link href="/pages/Cart" legacyBehavior>
            <a className="hover:text-blue-400 transition">Cart</a>
          </Link>
          <Link href="#contact" legacyBehavior>
            <a className="hover:text-blue-400 transition">Contact</a>
          </Link>
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="darkModeToggle"
              checked={isDarkMode}
              onChange={toggleDarkMode}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="darkModeToggle"
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            >
              <span className="toggle-icon sun-icon absolute left-1 top-1 w-4 h-4 bg-yellow-500 rounded-full"></span>
              <span className="toggle-icon moon-icon absolute right-1 top-1 w-4 h-4 bg-gray-900 rounded-full"></span>
            </label>
          </div>
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
          <Link href="pages/products" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-200">Products</a>
          </Link>
          <Link href="/pages/Cart" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-200">Cart</a>
          </Link>
          <Link href="#contact" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-gray-700 dark:hover:bg-gray-200">Contact</a>
          </Link>
          <div className="flex items-center justify-center my-4">
            <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="toggle"
                id="darkModeToggleMobile"
                checked={isDarkMode}
                onChange={toggleDarkMode}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="darkModeToggleMobile"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              >
                <span className="toggle-icon sun-icon absolute left-1 top-1 w-4 h-4 bg-yellow-500 rounded-full"></span>
                <span className="toggle-icon moon-icon absolute right-1 top-1 w-4 h-4 bg-gray-900 rounded-full"></span>
              </label>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;