"use client";
import Sidebar from "@/components/sidebar";
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi"; // Importing the icon for the sidebar toggle button
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

interface Product {
  id: string;
  ProductName: string;
  Type: string;
  Price: number;
  Images: string[];
  Sizes: { size: string; quantity: number }[];
}

interface Order {
  date: string;
  total: number;
}

const AdminHome = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    axios.get("https://amaria-backend.vercel.app/api/admin/getAllProducts").then((response) => {
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
    labels: orders.map((order) => order.date),
    datasets: [
      {
        label: "Total Orders",
        data: orders.map((order) => order.total),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`https://amaria-backend.vercel.app/api/admin/deleteProduct/${id}`);
        setProducts(products.filter(product => product.id !== id));
        setFilteredProducts(filteredProducts.filter(product => product.id !== id));
        alert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleCardClick = (id: string) => {
    if (!editing) {
      router.push(`/pages/editProduct/${id}`);
    }
  };

  const handleTextChange = (id: string, field: keyof Product, value: string | number) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} flex min-h-screen`}>
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="absolute top-4 left-4 md:hidden">
        <button 
          onClick={toggleSidebar} 
          className="text-white bg-blue-600 p-2 rounded-full shadow-lg focus:outline-none"
        >
          <HiMenuAlt1 size={24} />
        </button>
      </div>

      <main className="flex-1 p-8 bg-gray-100 dark:bg-black transition-all duration-300 ease-in-out">
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
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleCardClick(product.id)}
            >
              <img src={product.Images[0]} alt={product.ProductName} className="mb-4 max-h-40 w-full object-cover rounded-md" />
              <div className="mb-2">
                <input
                  type="text"
                  value={product.ProductName}
                  onChange={(e) => handleTextChange(product.id, 'ProductName', e.target.value)}
                  className="bg-transparent w-full text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-transparent focus:outline-none focus:border-blue-500"
                  disabled={!editing}
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  value={product.Type}
                  onChange={(e) => handleTextChange(product.id, 'Type', e.target.value)}
                  className="bg-transparent w-full text-gray-600 dark:text-gray-400 border-b border-transparent focus:outline-none focus:border-blue-500"
                  disabled={!editing}
                />
              </div>
              <div className="mb-2">
                <input
                  type="number"
                  value={product.Price}
                  onChange={(e) => handleTextChange(product.id, 'Price', e.target.value)}
                  className="bg-transparent w-full text-gray-600 dark:text-gray-400 border-b border-transparent focus:outline-none focus:border-blue-500"
                  disabled={!editing}
                />
              </div>
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
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  className="text-blue-500 hover:underline font-bold"
                  onClick={(e) => { e.stopPropagation(); toggleEditing(); }}
                >
                  <FaEdit className="inline-block mr-2" />
                  {editing ? 'Save' : 'Edit'}
                </button>
                <button
                  className="text-red-500 hover:underline font-bold"
                  onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                >
                  <FaTrash className="inline-block mr-2" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Add New Product</h2>
            <AddProduct />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg"
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
