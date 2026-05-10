import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import type { IMenuItem } from '@shared/types';

interface MenuItemCardProps {
  item: IMenuItem;
  onAdd: (item: IMenuItem) => void;
}

export default function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-1 flex flex-col">
        <h4 className="font-bold text-dark text-lg">{item.name}</h4>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-1">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-lg text-dark">${item.price.toFixed(2)}</span>
          <button 
            onClick={() => onAdd(item)}
            className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2 rounded-xl transition-colors flex items-center justify-center"
            aria-label={`Add ${item.name} to cart`}
          >
            <HiPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="w-32 h-32 flex-shrink-0 relative rounded-xl overflow-hidden shadow-sm">
        <img 
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.category && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-semibold text-dark capitalize shadow-sm">
            {item.category.replace('_', ' ')}
          </div>
        )}
      </div>
    </motion.div>
  );
}
