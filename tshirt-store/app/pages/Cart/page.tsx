// pages/cart.tsx
"use client";
import { useRouter } from 'next/navigation'; // Import useRouter
import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbar'; // Adjusted import path for the Navbar component

interface CartItem {
  id: string;
  ProductName: string;
  Quantity: number;
  TotalPrice: number;
  Images: string[];
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Fake data for cart items
    const fakeCartItems: CartItem[] = [
      {
        id: '1',
        ProductName: 'Cool T-shirt',
        Quantity: 2,
        TotalPrice: 20.00,
        Images: ['https://via.placeholder.com/60']
      },
      {
        id: '2',
        ProductName: 'Comfy Hoodie',
        Quantity: 1,
        TotalPrice: 35.00,
        Images: ['https://via.placeholder.com/60']
      },
      {
        id: '3',
        ProductName: 'Stylish Jeans',
        Quantity: 1,
        TotalPrice: 45.00,
        Images: ['https://via.placeholder.com/60']
      }
    ];

    setCartItems(fakeCartItems);
    calculateTotal(fakeCartItems);
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.Quantity * item.TotalPrice, 0);
    setTotalPrice(total);
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      calculateTotal(updatedItems);
      return updatedItems;
    });
  };

  return (
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen">
      <Navbar />
      <div className="py-12">
        <div className="max-w-md mx-auto bg-zinc-900 dark:bg-gray-200 shadow-lg rounded-lg md:max-w-5xl">
          <div className="md:flex">
            <div className="w-full p-4 px-5 py-5">
              <div className="md:grid md:grid-cols-3 gap-2">
                <div className="col-span-2 p-5">
                  <h1 className="text-xl font-medium">Shopping Cart</h1>

                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                      <div className="flex justify-center items-center">
                        <div className="pr-8 flex">
                          <span className="font-semibold cursor-pointer">-</span>
                          <input
                            type="text"
                            className="focus:outline-none bg-gray-100 dark:bg-gray-300 border h-6 w-8 rounded text-sm px-2 mx-2 text-center text-black"
                            value={item.Quantity}
                            readOnly
                          />
                          <span className="font-semibold cursor-pointer">+</span>
                        </div>
                        <div className="pr-8">
                          <span className="text-xs font-medium">${item.TotalPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <i className="fa fa-close text-xs font-medium cursor-pointer" onClick={() => removeItem(item.id)}></i>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <i className="fa fa-arrow-left text-sm pr-2"></i>
                      <span className="text-md font-medium text-blue-500 cursor-pointer">Continue Shopping</span>
                    </div>
                    <div className="flex justify-center items-end">
                      <span className="text-sm font-medium text-gray-400 mr-1">Subtotal:</span>
                      <span className="text-lg font-bold text-white dark:text-black">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Section */}
                <div className="p-5 bg-gray-800 dark:bg-gray-300 rounded overflow-visible ">
                  <span className="text-xl font-medium text-gray-100 dark:text-black block pb-3">Checkout</span>
                  <p className="text-gray-400 dark:text-black">Cash on delivery only</p>
                  <button 
                    className="h-12 w-full bg-blue-500 rounded focus:outline-none text-white hover:bg-blue-600 mt-4"
                    onClick={() => router.push("/pages/checkout")} // Redirect to checkout page
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
