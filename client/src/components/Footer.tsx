import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
                FD
              </div>
              <span className="text-xl font-extrabold text-dark tracking-tight">FoodDash</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed pr-4">
              Delivering the best local food right to your doorstep. Fast, fresh, and always delicious.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-dark mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Blog</Link></li>
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-dark mb-4 uppercase tracking-wider text-sm">For Partners</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-gray-500 hover:text-primary transition-colors text-sm">Add your restaurant</Link></li>
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Become a driver</Link></li>
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Partner Resources</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-dark mb-4 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FoodDash Inc. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            Made with <HiHeart className="text-error w-4 h-4 mx-1" /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
