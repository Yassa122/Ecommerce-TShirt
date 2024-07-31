"use client";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";

// Define the type for cart items
interface CartItem {
  id: string;
  ProductName: string;
  Quantity: number;
  TotalPrice: number;
  Images: string[];
}

interface Area {
  name: string;
  fee: number;
}

const cairoAreas: Area[] = [
  { name: "Downtown", fee: 60 },
  { name: "Zamalek", fee: 60 },
  { name: "Maadi", fee: 60 },
  { name: "Nasr City", fee: 60 },
  { name: "Heliopolis", fee: 60 },
  { name: "Garden City", fee: 60 },
  { name: "New Cairo", fee: 60 },
  { name: "Giza", fee: 60 },
  { name: "Mohandessin", fee: 60 },
  { name: "Dokki", fee: 60 },
  { name: "October - El Shorouk - Badr City", fee: 60 },
  { name: "Alexandria - Suez - Ismailia - Port Said", fee: 75 },
  { name: "Qalyubia - Kafr El Sheikh - Beheira - Dakahlia - Menoufia - Mansoura - Damietta - Beni Suef - Sharqia", fee: 85 },
  { name: "Faiyum - Assiut - Sohag - Qena", fee: 105 },
  { name: "Hurghada - Sharm El Sheikh - Ain Sokhna - South Sinai - Luxor - Aswan", fee: 115 },
  { name: "Bahariya Oasis - Marsa Alam - North Coast", fee: 150 }
];

const CheckoutPage: React.FC = () => {
  const [shippingInfo, setShippingInfo] = useState({ address: "", area: "", email: "" });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Fetch cart items from local storage
    const items: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
    calculateTotal(items, 0); // Initial calculation without delivery fee
  }, []);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
    if (name === "area") {
      const selectedArea = cairoAreas.find(area => area.name === value);
      const fee = selectedArea ? selectedArea.fee : 0;
      setDeliveryFee(fee);
      calculateTotal(cartItems, fee);
    }
  };

  const calculateTotal = (items: CartItem[], fee: number) => {
    const itemsTotal = items.reduce((sum, item) => sum + item.Quantity * item.TotalPrice, 0);
    setTotalPrice(itemsTotal + fee);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Send data to backend for processing
    axios.post("https://amaria-backend.vercel.app/api/users/checkout", { shippingInfo, cartItems })
      .then(response => {
        alert("Order placed successfully!");
        localStorage.removeItem('cartItems'); // Clear the cart
        router.push("/pages/orderConfirmed");
      })
      .catch(error => console.error("Error processing checkout:", error));
  };

  return (
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Checkout
        </motion.h1>
        <motion.div
          className="flex flex-col md:flex-row md:space-x-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Shipping Information */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex-1 bg-zinc-900 dark:bg-white shadow-md rounded-lg p-6 text-white dark:text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
            <div className="mb-4">
              <label className="block text-gray-300 dark:text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-600 dark:border-gray-300 rounded-lg bg-neutral-700 dark:bg-gray-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 dark:text-gray-700">Area in Cairo</label>
              <select
                name="area"
                value={shippingInfo.area}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-600 dark:border-gray-300 rounded-lg bg-neutral-700 dark:bg-gray-200"
                required
              >
                <option value="" disabled>Select your area</option>
                {cairoAreas.map((area, index) => (
                  <option key={index} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 dark:text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={shippingInfo.email}
                onChange={handleShippingChange}
                className="w-full p-2 border border-gray-600 dark:border-gray-300 rounded-lg bg-neutral-700 dark:bg-gray-200"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition w-full"
            >
              Complete Order
            </button>
          </motion.form>

          {/* Order Summary */}
          <motion.div
            className="flex-1 bg-zinc-900 dark:bg-white shadow-md rounded-lg p-6 text-white dark:text-black flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <img
                      src={item.Images[0]}
                      width="60"
                      className="rounded-full"
                      alt={item.ProductName}
                    />
                    <div className="flex flex-col ml-3">
                      <span className="md:text-md font-medium">{item.ProductName}</span>
                      <span className="text-xs font-light text-gray-400">#{item.id}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-md font-medium">{item.Quantity} x ${item.TotalPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-600 dark:border-gray-300 mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Delivery Fee:</span>
                  <span className="text-lg font-bold">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="text-right mt-8">
              <p className="text-gray-400 mb-4">Payment will be made upon delivery (Cash on Delivery).</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
