import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { HiOutlineShoppingBag, HiOutlineUser, HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30">
                FD
              </div>
              <span className="text-2xl font-extrabold text-dark tracking-tight">FoodDash</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-gray-600 hover:text-primary font-semibold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
              {user ? (
                <>
                  <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                    <HiOutlineShoppingBag className="w-6 h-6" />
                    {/* Cart badge would go here */}
                  </Link>
                  <Link to={user.role === 'customer' ? '/profile' : `/${user.role}`} className="flex items-center gap-2 text-gray-600 hover:text-primary font-semibold transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <HiOutlineUser className="w-5 h-5" />
                      )}
                    </div>
                    <span className="hidden lg:block">{user.name?.split(' ')[0]}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-dark font-bold hover:text-primary transition-colors">
                    Log In
                  </Link>
                  <Link to="/register" className="bg-dark text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-md">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-dark focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <HiX className="h-7 w-7" /> : <HiMenu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary hover:bg-primary/5"
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-100 mt-4 pt-4 pb-2">
                {user ? (
                  <div className="space-y-2">
                    <Link 
                      to="/cart" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-3 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary hover:bg-primary/5"
                    >
                      <HiOutlineShoppingBag className="w-5 h-5 mr-3" />
                      Cart
                    </Link>
                    <Link 
                      to={user.role === 'customer' ? '/profile' : `/${user.role}`} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-3 py-3 rounded-xl text-base font-semibold text-gray-700 hover:text-primary hover:bg-primary/5"
                    >
                      <HiOutlineUser className="w-5 h-5 mr-3" />
                      My Account
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 px-3 mt-2">
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-3 rounded-xl border border-gray-200 text-dark font-bold hover:bg-gray-50 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-3 rounded-xl bg-dark text-white font-bold hover:bg-black transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
