"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
  area: string;
  email: string;
}

interface CartItem {
  id: string;
  ProductName: string;
  Quantity: number;
  TotalPrice: number;
  Images: string[];
}

interface OrderDetails {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  shippingInfo: ShippingInfo;
  cartItems: CartItem[];
  deliveryFee: number;
}

const OrderConfirmed = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('orderDetails') || '{}');
    setOrderDetails(details);
  }, []);

  const handleContinueShopping = () => {
    router.push('/'); // Redirect to home or shopping page
  };

  if (!orderDetails) {
    return <div>Loading...</div>; // Add a loading state while fetching the order details
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <FaCheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="mb-8 text-lg">Thank you for your purchase. Your order has been successfully placed.</p>

        {orderDetails && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <p className="mb-1"><strong>Order ID:</strong> <span className="font-bold">{orderDetails.orderId}</span></p>
            <p className="mb-1"><strong>Order Date:</strong> {orderDetails.orderDate}</p>
            <p className="mb-1"><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
            <p className="mb-1"><strong>Delivery Fee:</strong> ${orderDetails.deliveryFee}</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Information</h3>
            {orderDetails.shippingInfo && (
              <>
                <p className="mb-1"><strong>Name:</strong> {orderDetails.shippingInfo.name}</p>
                <p className="mb-1"><strong>Phone:</strong> {orderDetails.shippingInfo.phone}</p>
                <p className="mb-1"><strong>Address:</strong> {orderDetails.shippingInfo.address}</p>
                <p className="mb-1"><strong>Area:</strong> {orderDetails.shippingInfo.area}</p>
                <p className="mb-1"><strong>Email:</strong> {orderDetails.shippingInfo.email}</p>
              </>
            )}
            <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>
            {orderDetails.cartItems && orderDetails.cartItems.map((item, index) => (
              <div key={index} className="mb-2">
                <p><strong>{item.ProductName}</strong> x {item.Quantity} - ${item.TotalPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}

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
