"use client";
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

const OrderConfirmed = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/'); // Redirect to home or shopping page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <FaCheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="mb-8 text-lg">Thank you for your purchase. Your order has been successfully placed.</p>

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p className="mb-1"><strong>Order Number:</strong> #123456</p>
          <p className="mb-1"><strong>Order Date:</strong> July 30, 2024</p>
          <p className="mb-1"><strong>Total Amount:</strong> $123.45</p>
        </div>

        <button
          onClick={handleContinueShopping}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition duration-200"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmed;
