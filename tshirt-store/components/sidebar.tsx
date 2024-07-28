// components/Sidebar.tsx
import { useEffect } from 'react';
import { FaBoxOpen, FaCog, FaHome, FaImage, FaShoppingCart } from 'react-icons/fa';

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) => {
  useEffect(() => {
    // Load the saved theme from local storage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, [setDarkMode]);

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-64 ${darkMode ? 'bg-zinc-900' : 'bg-white'} p-6 shadow-lg z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <button onClick={() => setSidebarOpen(false)} className={`block md:hidden text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
        &times; Close
      </button>
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>Admin Dashboard</h2>
      <nav className="space-y-4">
        <a href="/pages/adminHome" className={`block flex items-center ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`}>
          <FaHome className="mr-2" /> Home
        </a>
        <a href="/pages/productsList" className={`block flex items-center ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`}>
          <FaBoxOpen className="mr-2" /> Products
        </a>
        <a href="/pages/gallery" className={`block flex items-center ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`}>
          <FaImage className="mr-2" /> Gallery
        </a>
        <a href="/pages/orders" className={`block flex items-center ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`}>
          <FaShoppingCart className="mr-2" /> Orders
        </a>
        <a href="/admin/settings" className={`block flex items-center ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-500'}`}>
          <FaCog className="mr-2" /> Settings
        </a>
        <div className="flex items-center mt-4">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</span>
          <label className="ml-auto inline-flex items-center cursor-pointer">
            <span className="relative inline-block w-12 h-6">
              <input type="checkbox" className="opacity-0 w-0 h-0" checked={darkMode} onChange={handleDarkModeToggle} />
              <span className="absolute cursor-pointer inset-0 rounded-full transition-colors duration-300 ease-in-out bg-gray-400 dark:bg-gray-700"></span>
              <span className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${darkMode ? 'translate-x-6 bg-blue-600' : 'translate-x-0 bg-white'}`}></span>
            </span>
          </label>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
