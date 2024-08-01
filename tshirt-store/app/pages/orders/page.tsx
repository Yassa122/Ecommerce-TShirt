// pages/orders.tsx
"use client";
import Sidebar from '@/components/sidebar';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface OrderItem {
  ProductName: string;
  Quantity: number;
  TotalPrice: number;
  Images: string[];
  selectedSize: string;
}

interface Order {
  id: string;
  orderedAt: Date;
  items: OrderItem[];
  total: number;
  status: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://amaria-backend.vercel.app/api/admin/orders');
        const fetchedOrders = response.data.map((doc: any) => {
          const items = [{
            ProductName: doc.ProductName,
            Quantity: doc.Quantity,
            TotalPrice: doc.TotalPrice,
            Images: doc.Images,
            selectedSize: doc.selectedSize
          }];

          return {
            id: doc.orderId,
            orderedAt: new Date(doc.orderedAt._seconds * 1000 + doc.orderedAt._nanoseconds / 1000000),
            items: items,
            total: items.reduce((sum, item) => sum + item.TotalPrice * item.Quantity, 0),
            status: doc.status,
          };
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const sortedOrders = [...orders].sort((a, b) => {
      return sortOrder === 'newest'
        ? b.orderedAt.getTime() - a.orderedAt.getTime()
        : a.orderedAt.getTime() - b.orderedAt.getTime();
    });
    setOrders(sortedOrders);
  }, [sortOrder, orders]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'table' : 'card');
  };

  const downloadCSV = () => {
    const csvContent = orders.map(order => {
      return order.items.map(item => 
        `${order.id},${order.orderedAt.toLocaleString()},${item.ProductName},${item.Quantity},${item.TotalPrice},${order.total},${order.status}`
      ).join('\n');
    }).join('\n');

    const header = 'Order ID,Date,ProductName,Quantity,Price,Total,Status\n';
    const csv = header + csvContent;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'orders.csv');
    link.click();
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-gray-100 text-black'}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">All Orders</h1>
          <div className="flex space-x-2">
            <button 
              onClick={toggleViewMode}
              className={`py-2 px-4 rounded-lg transition mr-2 ${
                viewMode === 'card' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {viewMode === 'card' ? 'Switch to Table View' : 'Switch to Card View'}
            </button>
            <button 
              onClick={downloadCSV}
              className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Download CSV
            </button>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="py-2 px-4 rounded-lg bg-gray-200 text-gray-800 border border-gray-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
                <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
                <p className="text-sm mb-4">Date: {order.orderedAt.toLocaleString()}</p>
                <div className="mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <img src={item.Images[0]} alt={item.ProductName} className="w-12 h-12 object-cover rounded mr-4" />
                      <div>
                        <p className="font-medium">{item.ProductName}</p>
                        <p className="text-sm">Quantity: {item.Quantity}</p>
                        <p className="text-sm">Price: ${item.TotalPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
                  <p className={`text-sm font-medium px-2 py-1 rounded ${order.status === 'Shipped' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`min-w-full ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
              <thead>
                <tr>
                  <th className="px-2 md:px-4 py-2 border-b dark:border-gray-700">Order ID</th>
                  <th className="px-2 md:px-4 py-2 border-b dark:border-gray-700">Date</th>
                  <th className="px-2 md:px-4 py-2 border-b dark:border-gray-700">Items</th>
                  <th className="px-2 md:px-4 py-2 border-b dark:border-gray-700">Total</th>
                  <th className="px-2 md:px-4 py-2 border-b dark:border-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b dark:border-gray-700">
                    <td className="px-2 md:px-4 py-2">{order.id}</td>
                    <td className="px-2 md:px-4 py-2">{order.orderedAt.toLocaleString()}</td>
                    <td className="px-2 md:px-4 py-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <img src={item.Images[0]} alt={item.ProductName} className="w-8 md:w-12 h-8 md:h-12 object-cover rounded mr-2" />
                          <div>
                            <p className="font-medium">{item.ProductName}</p>
                            <p className="text-sm">Qty: {item.Quantity}</p>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="px-2 md:px-4 py-2">${order.total.toFixed(2)}</td>
                    <td className="px-2 md:px-4 py-2">
                      <span className={`px-2 py-1 rounded ${order.status === 'Shipped' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
