import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../services/orderApi';
import { io } from 'socket.io-client';
import { HiOutlineCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { motion } from 'framer-motion';

const ORDER_STATUSES = ['placed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [currentStatus, setCurrentStatus] = useState<string>('placed');

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id!),
    enabled: !!id,
  });

  const order = data?.data;

  useEffect(() => {
    if (order?.status) {
      setCurrentStatus(order.status);
    }
  }, [order?.status]);

  useEffect(() => {
    // Connect to Socket.io for live tracking
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      newSocket.emit('join:order', id);
    });

    newSocket.on('orderStatusChanged', (data) => {
      if (data.status) {
        setCurrentStatus(data.status);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const currentStepIndex = ORDER_STATUSES.indexOf(currentStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/orders" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-dark mb-8 transition-colors">
        <HiArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-dark p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Order #{order.orderId}</p>
              <h1 className="text-3xl font-bold">{order.restaurant?.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm font-medium mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-primary">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Tracking Progress Bar */}
        <div className="p-10 border-b border-gray-100 bg-surface/50">
          <h2 className="text-xl font-bold text-dark mb-8 text-center">Live Tracking</h2>
          
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
            
            {/* Active Line */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(Math.max(0, currentStepIndex) / (ORDER_STATUSES.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="absolute top-5 left-0 h-1 bg-primary rounded-full"
            ></motion.div>

            {/* Status Steps */}
            <div className="relative flex justify-between">
              {ORDER_STATUSES.map((status, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={status} className="flex flex-col items-center">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: isCurrent ? 1.2 : 1, backgroundColor: isActive ? '#f97316' : '#fff' }}
                      className={`w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 transition-colors duration-300 ${isActive ? 'border-primary text-white shadow-lg shadow-primary/30' : 'border-gray-200 bg-white'}`}
                    >
                      {isActive && <HiOutlineCheckCircle className="w-6 h-6" />}
                    </motion.div>
                    <span className={`mt-3 text-sm font-bold capitalize ${isActive ? 'text-dark' : 'text-gray-400'}`}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-dark mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item._id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center">
                  <span className="font-bold text-dark bg-gray-100 px-2 py-1 rounded text-sm mr-4">{item.quantity}x</span>
                  <span className="font-medium text-gray-700">{item.menuItem?.name}</span>
                </div>
                <span className="font-bold text-dark">${item.itemTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Delivery Details</h4>
              <p className="font-semibold text-dark">{order.customer?.name}</p>
              <p className="text-gray-600 mt-1">{order.deliveryAddress?.street}</p>
              <p className="text-gray-600">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Payment</h4>
              <p className="font-semibold text-dark capitalize">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
