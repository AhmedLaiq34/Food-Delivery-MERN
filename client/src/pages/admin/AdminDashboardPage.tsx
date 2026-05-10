import { useAuthStore } from '../../store/useAuthStore';
import { HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineChartPie, HiOutlineCash } from 'react-icons/hi';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    { title: 'Total Revenue', value: '$124,500', icon: HiOutlineCash, color: 'text-green-500', bg: 'bg-green-100' },
    { title: 'Active Restaurants', value: '142', icon: HiOutlineOfficeBuilding, color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Total Users', value: '12,890', icon: HiOutlineUserGroup, color: 'text-purple-500', bg: 'bg-purple-100' },
    { title: 'Platform Fee (10%)', value: '$12,450', icon: HiOutlineChartPie, color: 'text-orange-500', bg: 'bg-orange-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">Welcome Admin, {user?.name}</h1>
        <p className="text-gray-500 mt-1">Platform overview and system metrics.</p>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-dark mb-4">Recent Payout Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-sm">
                <th className="pb-3 font-medium">Chef / Restaurant</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-dark">Gordon Ramsay (Hell's Kitchen)</td>
                  <td className="py-4 font-bold text-dark">$1,500.00</td>
                  <td className="py-4 text-gray-600">May 10, 2026</td>
                  <td className="py-4">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                  </td>
                  <td className="py-4">
                    <button className="text-primary font-bold hover:underline">Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
