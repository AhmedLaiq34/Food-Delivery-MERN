import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, clearCart } from '../services/cartApi';
import { HiOutlineTrash, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared');
    },
  });

  const cart = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center bg-surface px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10 bg-white rounded-3xl shadow-xl shadow-gray-200/40 max-w-md w-full"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            to="/" 
            className="block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
          >
            Explore Restaurants
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-dark">Your Cart</h1>
        <button 
          onClick={() => clearCartMutation.mutate()}
          className="text-error hover:bg-error/10 px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
        >
          <HiOutlineTrash className="w-4 h-4 mr-1.5" />
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="divide-y divide-gray-50">
          {cart.items.map((item: any, index: number) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item._id} 
              className="p-6 flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img 
                  src={item.menuItem?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'} 
                  alt={item.menuItem?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-dark">{item.menuItem?.name}</h3>
                {item.specialInstructions && (
                  <p className="text-sm text-gray-500 mt-1">Note: {item.specialInstructions}</p>
                )}
                <div className="text-primary font-bold mt-2">${(item.itemTotal / item.quantity).toFixed(2)}</div>
              </div>
              
              <div className="flex items-center gap-4 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                <button className="p-2 text-gray-400 hover:text-dark transition-colors">
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-dark w-4 text-center">{item.quantity}</span>
                <button className="p-2 text-gray-400 hover:text-dark transition-colors">
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="font-bold text-dark text-lg w-20 text-right">
                ${item.itemTotal.toFixed(2)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-4 text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium text-dark">${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-medium text-dark">${cart.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span className="font-medium text-dark">${cart.tax.toFixed(2)}</span>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xl font-bold text-dark">Total</span>
            <span className="text-2xl font-black text-primary">${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/checkout')}
          className="w-full mt-8 bg-dark text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xl shadow-dark/20"
        >
          Proceed to Checkout
          <HiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
