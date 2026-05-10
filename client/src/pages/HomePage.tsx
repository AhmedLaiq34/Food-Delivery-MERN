import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '../services/restaurantApi';
import RestaurantCard from '../components/RestaurantCard';
import { HiOutlineSearch, HiFilter } from 'react-icons/hi';
import { motion } from 'framer-motion';
import type { IRestaurant } from '@shared/types';
import { useState } from 'react';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => getRestaurants(),
  });

  const restaurants: IRestaurant[] = data?.data || [];

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.cuisines?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="bg-dark text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80" 
            alt="Food background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Delicious food, <br/>
              <span className="text-primary">delivered to you.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-medium">
              Discover the best local restaurants, fast delivery, and amazing deals in your area.
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-4 max-w-xl bg-white p-2 rounded-2xl shadow-2xl">
              <div className="flex-1 relative flex items-center">
                <HiOutlineSearch className="w-6 h-6 text-gray-400 absolute left-4" />
                <input 
                  type="text" 
                  placeholder="Search restaurants or cuisines..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-0 text-dark placeholder-gray-400 text-lg"
                />
              </div>
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                Find Food
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-dark">Popular Near You</h2>
            <p className="text-gray-500 mt-2">Explore top-rated restaurants in your neighborhood</p>
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <HiFilter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-error">
            Failed to load restaurants. Please try again later.
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant._id as string}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-2xl font-bold text-dark mb-2">No restaurants found</h3>
            <p className="text-gray-500">We couldn't find any restaurants matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
