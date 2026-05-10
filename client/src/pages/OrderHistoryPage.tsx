import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../services/orderApi';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineClock, HiChevronRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function OrderHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
  });

  const orders = data?.data || [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'payment_failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="min-h-[80vh] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <div className="bg-primary/10 p-3 rounded-xl text-primary mr-4">
          <HiOutlineShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-dark">Order History</h1>
          <p className="text-gray-500">View and track your recent orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineClock className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-dark mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
          <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={order._id} 
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img 
                      src={order.restaurant?.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'} 
                      alt={order.restaurant?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-1">{order.restaurant?.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 gap-3">
                      <span>{format(new Date(order.createdAt), 'MMM dd, yyyy • h:mm a')}</span>
                      <span>•</span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                      <span>•</span>
                      <span>{order.items.length} items</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <Link 
                    to={`/order/${order._id}`}
                    className="flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors group-hover:translate-x-1 duration-300"
                  >
                    View Details
                    <HiChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
