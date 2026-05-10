import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiClock, HiCurrencyDollar } from 'react-icons/hi';
import type { IRestaurant } from '@shared/types';

interface RestaurantCardProps {
  restaurant: IRestaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${restaurant._id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={restaurant.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'} 
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-sm">
            <HiStar className="text-yellow-400 w-4 h-4 mr-1" />
            <span className="text-sm font-semibold text-dark">{restaurant.rating?.toFixed(1) || 'New'}</span>
          </div>
          {/* Discount badge if applicable */}
          <div className="absolute bottom-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            Free Delivery
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-dark truncate pr-4">{restaurant.name}</h3>
          </div>
          
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
            {restaurant.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto pt-4 border-t border-gray-50">
            <div className="flex items-center">
              <HiClock className="w-4 h-4 mr-1.5 text-primary" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <HiCurrencyDollar className="w-4 h-4 mr-1.5 text-primary" />
              <span>Delivery: ${restaurant.deliveryFee?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
