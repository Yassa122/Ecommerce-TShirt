"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import axios from "axios";
import {
  ArcElement,
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
import { Doughnut, Line } from "react-chartjs-2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi"; // Importing the icon for the sidebar toggle button
import AddProduct from "../addProduct/page";
import { requestNotificationPermission, messaging } from "../../config/firebaseConfig";
import { onMessage } from "firebase/messaging";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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
  deliveryFee: number;
  netWorth: number;
}

const AdminHome: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);

    axios.get("https://amaria-backend.vercel.app/api/admin/getAllProducts").then((response) => {
      setProducts(response.data);
      setFilteredProducts(response.data);
    });

    axios.get("https://amaria-backend.vercel.app/api/admin/orders").then((response) => {
      const transformedOrders = response.data.map((order: any) => ({
        date: new Date(order.orderedAt._seconds * 1000).toLocaleDateString(),
        total: order.TotalPrice,
        deliveryFee: order.deliveryFee || 0,  // Assuming deliveryFee is part of the order data
        netWorth: order.TotalPrice - (order.deliveryFee || 0)
      }));
      setOrders(transformedOrders);
    });

    // Request permission for notifications
    requestNotificationPermission();

    // Handle incoming messages
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Customize your notification here
      alert(payload.notification?.title);
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

  // Calculate total net worth and delivery fees
  const totalNetWorth = orders.reduce((sum, order) => sum + order.netWorth, 0);
  const totalDeliveryFees = orders.reduce((sum, order) => sum + order.deliveryFee, 0);

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
      {
        label: "Delivery Fees",
        data: orders.map((order) => order.deliveryFee),
        fill: false,
        borderColor: "rgba(255, 159, 64, 1)",
        tension: 0.1,
      },
      {
        label: "Net Worth",
        data: orders.map((order) => order.netWorth),
        fill: false,
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.1,
      },
    ],
  };

  const donutData = {
    labels: ['Net Worth', 'Delivery Fees'],
    datasets: [
      {
        label: 'Financial Overview',
        data: [totalNetWorth, totalDeliveryFees],
        backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
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

  const handleCardClick = (product: Product) => {
    if (!editing) {
      setEditedProduct(product);
      setEditing(true);
    }
  };

  const handleTextChange = (field: keyof Product, value: string | number) => {
    if (editedProduct) {
      setEditedProduct({ ...editedProduct, [field]: value });
    }
  };

  const saveChanges = async () => {
    if (editedProduct) {
      try {
        await axios.put(`https://amaria-backend.vercel.app/api/admin/editProduct/${editedProduct.id}`, editedProduct);
        setProducts(products.map(product => product.id === editedProduct.id ? editedProduct : product));
        setFilteredProducts(filteredProducts.map(product => product.id === editedProduct.id ? editedProduct : product));
        setEditing(false);
        setEditedProduct(null);
        alert("Product updated successfully!");
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product. Please try again.");
      }
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditedProduct(null);
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
        {editing && editedProduct ? (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Edit Product</h2>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
              <input
                type="text"
                value={editedProduct.ProductName}
                onChange={(e) => handleTextChange('ProductName', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Type</label>
              <input
                type="text"
                value={editedProduct.Type}
                onChange={(e) => handleTextChange('Type', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Price</label>
              <input
                type="number"
                value={editedProduct.Price}
                onChange={(e) => handleTextChange('Price', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Sizes</label>
              <ul className="list-disc pl-5">
                {editedProduct.Sizes.map((sizeObj, index) => (
                  <li key={index} className="mt-1">
                    <span className="font-medium">Size:</span> 
                    <input
                      type="text"
                      value={sizeObj.size}
                      onChange={(e) => handleTextChange(`Sizes.${index}.size` as keyof Product, e.target.value)}
                      className="bg-transparent w-full text-gray-600 dark:text-gray-400 border-b border-transparent focus:outline-none focus:border-blue-500"
                    />
                    <span className="font-medium"> Quantity:</span>
                    <input
                      type="number"
                      value={sizeObj.quantity}
                      onChange={(e) => handleTextChange(`Sizes.${index}.quantity` as keyof Product, e.target.value)}
                      className="bg-transparent w-full text-gray-600 dark:text-gray-400 border-b border-transparent focus:outline-none focus:border-blue-500"
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="text-blue-500 hover:underline font-bold"
                onClick={saveChanges}
              >
                Save
              </button>
              <button
                className="text-red-500 hover:underline font-bold"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleCardClick(product)}
              >
                <img src={product.Images[0]} alt={product.ProductName} className="mb-4 max-h-40 w-full object-cover rounded-md" />
                <div className="mb-2">
                  <input
                    type="text"
                    value={product.ProductName}
                    onChange={(e) => handleTextChange('ProductName', e.target.value)}
                    className="bg-transparent w-full text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-transparent focus:outline-none focus:border-blue-500"
                    disabled={!editing}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    value={product.Type}
                    onChange={(e) => handleTextChange('Type', e.target.value)}
                    className="bg-transparent w-full text-gray-600 dark:text-gray-400 border-b border-transparent focus:outline-none focus:border-blue-500"
                    disabled={!editing}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="number"
                    value={product.Price}
                    onChange={(e) => handleTextChange('Price', e.target.value)}
                    className="bg-transparent w-full text-gray-600 dark:text-gray-400 border-b border-transparent focus:outline-none focus:border-blue-500"
                    disabled={!editing}
                  />
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <p className="font-medium">Sizes and Quantities:</p>
                  <ul className="list-disc pl-5">
                    {product.Sizes.map((sizeObj, index) => (
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
        )}

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

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Financial Overview</h2>
            <Doughnut data={donutData} />
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
