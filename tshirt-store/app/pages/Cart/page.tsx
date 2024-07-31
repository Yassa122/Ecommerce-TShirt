"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/navbar';

interface CartItem {
  id: string;
  ProductName: string;
  Quantity: number;
  TotalPrice: number;
  Images: string[];
  selectedSize: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    // Fetch cart items from local storage
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]') as CartItem[];
    setCartItems(items);
    calculateTotal(items);
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.Quantity * item.TotalPrice, 0);
    setTotalPrice(total);
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, Quantity: Math.max(1, item.Quantity + quantity) } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      calculateTotal(updatedItems);
      return updatedItems;
    });
  };

  const removeItem = (id: string) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      calculateTotal(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
    setTotalPrice(0);
  };

  return (
    <div className="bg-zinc-950 dark:bg-gray-100 text-white dark:text-black min-h-screen">
      <Navbar />
      <div className="py-12">
        <div className="max-w-full lg:max-w-5xl mx-auto bg-zinc-900 dark:bg-gray-200 shadow-lg rounded-lg">
          <div className="md:flex">
            <div className="w-full p-4 px-5 py-5">
              <div className="md:grid md:grid-cols-3 gap-4">
                <div className="col-span-2 p-5">
                  <h1 className="text-xl font-medium">Shopping Cart</h1>

                  {cartItems.length > 0 ? cartItems.map(item => (
                    <div key={item.id} className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                      <div className="flex flex-col md:flex-row justify-center items-center mt-4 md:mt-0">
                        <div className="pr-8 flex items-center">
                          <button
                            className="font-semibold cursor-pointer"
                            onClick={() => updateItemQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="focus:outline-none bg-gray-100 dark:bg-gray-300 border h-6 w-8 rounded text-sm px-2 mx-2 text-center text-black"
                            value={item.Quantity}
                            readOnly
                          />
                          <button
                            className="font-semibold cursor-pointer"
                            onClick={() => updateItemQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <div className="pr-8 mt-2 md:mt-0">
                          <span className="text-xs font-medium">${item.TotalPrice.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <i
                            className="fa fa-close text-xs font-medium cursor-pointer"
                            onClick={() => removeItem(item.id)}
                          ></i>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Your cart is empty.</p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4 md:mb-0">
                      <i className="fa fa-arrow-left text-sm pr-2"></i>
                      <span className="text-md font-medium text-blue-500 cursor-pointer" onClick={() => router.push('/')}>Continue Shopping</span>
                    </div>
                    <div className="flex justify-center items-end">
                      <span className="text-sm font-medium text-gray-400 mr-1">Subtotal:</span>
                      <span className="text-lg font-bold text-white dark:text-black">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Clear Cart Button */}
                  {cartItems.length > 0 && (
                    <div className="mt-6 flex justify-center">
                      <button 
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={clearCart}
                      >
                        Clear Cart
                      </button>
                    </div>
                  )}
                </div>

                {/* Checkout Section */}
                <div className="p-5 bg-neutral-800 dark:bg-gray-300 rounded overflow-visible">
                  <span className="text-xl font-medium text-gray-100 dark:text-black block pb-3">Checkout</span>
                  <p className="text-gray-400 dark:text-black">Cash on delivery only</p>
                  <button 
                    className="h-12 w-full bg-blue-500 rounded focus:outline-none text-white hover:bg-blue-600 mt-4"
                    onClick={() => router.push("/pages/checkout")}
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
