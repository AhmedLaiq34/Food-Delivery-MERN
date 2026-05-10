import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRestaurantById, getRestaurantMenu } from '../services/restaurantApi';
import MenuItemCard from '../components/MenuItemCard';
import { HiStar, HiClock, HiCurrencyDollar, HiLocationMarker } from 'react-icons/hi';
import { motion } from 'framer-motion';
import type { IMenuItem, IRestaurant } from '@shared/types';

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();

  const { data: restaurantResponse, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => getRestaurantById(id!),
    enabled: !!id,
  });

  const { data: menuResponse, isLoading: isLoadingMenu } = useQuery({
    queryKey: ['menu', id],
    queryFn: () => getRestaurantMenu(id!),
    enabled: !!id,
  });

  if (isLoadingRestaurant || isLoadingMenu) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const restaurant: IRestaurant = restaurantResponse?.data;
  const menu: IMenuItem[] = menuResponse?.data || [];

  if (!restaurant) return <div className="text-center py-20 text-xl font-medium">Restaurant not found</div>;

  // Group menu items by category
  const groupedMenu = menu.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, IMenuItem[]>);

  const handleAddToCart = (item: IMenuItem) => {
    // We will implement cart logic in the next phase
    console.log('Adding to cart:', item);
  };

  return (
    <div className="pb-20">
      {/* Restaurant Header */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-dark">
        <img 
          src={restaurant.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'} 
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {restaurant.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-6 text-gray-200"
          >
            <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              <HiStar className="text-yellow-400 w-5 h-5 mr-1.5" />
              <span className="font-semibold text-white">{restaurant.rating?.toFixed(1) || 'New'}</span>
              <span className="ml-1 text-gray-300">({restaurant.reviewCount || 0} reviews)</span>
            </div>
            <div className="flex items-center">
              <HiClock className="w-5 h-5 mr-1.5 text-primary" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <HiCurrencyDollar className="w-5 h-5 mr-1.5 text-primary" />
              <span>${restaurant.deliveryFee?.toFixed(2)} delivery</span>
            </div>
            <div className="flex items-center">
              <HiLocationMarker className="w-5 h-5 mr-1.5 text-primary" />
              <span>{restaurant.address?.city}, {restaurant.address?.state}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Menu Section */}
          <div className="lg:col-span-2">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-dark capitalize mb-6 flex items-center">
                  {category.replace('_', ' ')}
                  <span className="ml-4 flex-1 h-px bg-gray-200"></span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map(item => (
                    <MenuItemCard key={item._id as string} item={item} onAdd={handleAddToCart} />
                  ))}
                </div>
              </div>
            ))}
            {menu.length === 0 && (
              <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-gray-300">
                <h3 className="text-xl font-bold text-dark mb-2">No menu items found</h3>
                <p className="text-gray-500">This restaurant hasn't added any dishes yet.</p>
              </div>
            )}
          </div>

          {/* Sidebar / Cart Preview (To be implemented later) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-gray-100 shadow-xl shadow-gray-200/40">
              <h3 className="text-xl font-bold text-dark mb-4">Your Cart</h3>
              <div className="text-center py-10">
                <p className="text-gray-500 mb-6">Your cart is empty. Add some delicious items from the menu!</p>
                <div className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold cursor-not-allowed">
                  Checkout
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
