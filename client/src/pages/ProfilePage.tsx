import { useAuthStore } from '../store/useAuthStore';
import { HiOutlineUser, HiOutlineMail, HiOutlineLogout } from 'react-icons/hi';
import { useMutation } from '@tanstack/react-query';
import { logoutFn } from '../services/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-dark mb-8">My Profile</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark p-8 text-white flex items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mr-6 border-2 border-white/50">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-white/80 capitalize font-medium">{user?.role}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <HiOutlineUser className="w-6 h-6 text-gray-400 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="font-bold text-dark">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <HiOutlineMail className="w-6 h-6 text-gray-400 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="font-bold text-dark">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <button 
              onClick={() => logoutMutation.mutate()}
              className="flex items-center text-error font-bold hover:bg-error/10 px-6 py-3 rounded-xl transition-colors"
            >
              <HiOutlineLogout className="w-5 h-5 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
