// components/Sidebar.tsx
import { FaBoxOpen, FaCog, FaHome, FaImages, FaPlusCircle, FaShoppingCart } from 'react-icons/fa';

interface SidebarProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-zinc-900 p-6 shadow-lg z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <button onClick={() => setSidebarOpen(false)} className="block md:hidden text-right text-gray-700 dark:text-gray-300 mb-6">
        &times; Close
      </button>
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Admin Dashboard</h2>
      <nav className="space-y-4">
        <a href="/pages/adminHome" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <FaHome className="mr-2" /> Home
        </a>
        <a href="/pages/productsList" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <FaBoxOpen className="mr-2" /> Products
        </a>
        <a href="/admin/add-product" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <FaPlusCircle className="mr-2" /> Add Product
        </a>
        <a href="/admin/orders" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <FaShoppingCart className="mr-2" /> Orders
        </a>
        <a href="/admin/settings" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <FaCog className="mr-2" /> Settings
        </a>
        <a href="/pages/gallery" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
          <FaImages className="mr-2" /> Gallery
        </a>
        <div className="flex items-center mt-4">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <label className="ml-auto inline-flex items-center cursor-pointer">
            <span className="relative">
              <input type="checkbox" className="hidden" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></span>
              <span className={`toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0 transition-transform ${darkMode ? 'translate-x-full bg-blue-600' : ''}`}></span>
            </span>
          </label>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
