"use client";
import axios from "axios";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import AddProduct from "../addProduct/page";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminHome = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    axios.get("http://localhost:3000/api/admin/getAllProducts").then((response) => {
      setProducts(response.data);
      setFilteredProducts(response.data);
    });

    axios.get("/api/admin/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const orderData = {
    labels: orders.map((order) => order.date), // Replace with actual date field
    datasets: [
      {
        label: "Total Orders",
        data: orders.map((order) => order.total), // Replace with actual total field
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className={`${darkMode ? "dark" : ""} flex min-h-screen`}>
      <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 p-6 shadow-lg z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <button onClick={() => setSidebarOpen(false)} className="block md:hidden text-right text-gray-700 dark:text-gray-300 mb-6">
          &times; Close
        </button>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Admin Dashboard</h2>
        <nav className="space-y-4">
          <a href="/admin/products" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <i className="fas fa-box-open mr-2"></i> Products
          </a>
          <a href="/admin/add-product" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <i className="fas fa-plus-circle mr-2"></i> Add Product
          </a>
          <a href="/admin/orders" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <i className="fas fa-shopping-cart mr-2"></i> Orders
          </a>
          <a href="/admin/settings" className="block flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
            <i className="fas fa-cog mr-2"></i> Settings
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

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden block p-4 bg-gray-700 text-white dark:bg-gray-900 dark:text-gray-300 focus:outline-none z-50 absolute top-4 left-4"
      >
        Menu
      </button>

      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-700 dark:text-gray-300">Dashboard</h1>
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 dark:focus:ring-blue-800"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
          <motion.div
          key={product.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={product.Images[0]} alt={product.ProductName} className="mb-4 max-h-40 w-full object-cover rounded-md" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{product.ProductName}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Price: ${product.Price}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Type: {product.Type}</p>
          <div className="text-gray-600 dark:text-gray-400">
            <p className="font-medium">Sizes and Quantities:</p>
            <ul className="list-disc pl-5">
              {product.Sizes && product.Sizes.map((sizeObj, index) => (
                <li key={index} className="mt-1">
                  <span className="font-medium">Size:</span> {sizeObj.size}, 
                  <span className="font-medium"> Quantity:</span> {sizeObj.quantity}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
        
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Add New Product</h2>
            <AddProduct />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Order Summary</h2>
            <Line data={orderData} />
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
