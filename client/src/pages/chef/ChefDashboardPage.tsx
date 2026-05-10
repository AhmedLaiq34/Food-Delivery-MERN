import { useAuthStore } from '../../store/useAuthStore';
import { HiOutlineChartBar, HiOutlineShoppingBag, HiOutlineUsers, HiOutlineCurrencyDollar } from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function ChefDashboardPage() {
  const { user } = useAuthStore();

  // Mock data for MVP
  const stats = [
    { title: 'Total Revenue', value: '$12,450', icon: HiOutlineCurrencyDollar, color: 'text-green-500', bg: 'bg-green-100' },
    { title: 'Total Orders', value: '456', icon: HiOutlineShoppingBag, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Active Menu Items', value: '32', icon: HiOutlineChartBar, color: 'text-purple-500', bg: 'bg-purple-100' },
    { title: 'Total Customers', value: '890', icon: HiOutlineUsers, color: 'text-orange-500', bg: 'bg-orange-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your restaurant today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center"
          >
            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl mr-4`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-dark">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 font-medium text-dark">#ORD-102{i}</td>
                    <td className="py-4 text-gray-600">John Doe</td>
                    <td className="py-4 text-gray-600">3 items</td>
                    <td className="py-4 font-bold text-dark">$45.00</td>
                    <td className="py-4">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">Preparing</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Popular Items</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80`} alt="Burger" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-dark text-sm">Classic Burger</h4>
                  <p className="text-xs text-gray-500">120 orders this week</p>
                </div>
                <div className="font-bold text-primary">$12.99</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
