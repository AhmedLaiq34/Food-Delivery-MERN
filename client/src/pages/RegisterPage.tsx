import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiEye, HiEyeOff, HiOutlineUser } from 'react-icons/hi';
import { registerSchema } from './auth.types';
import type { IRegisterInput } from './auth.types';
import { registerFn } from '../services/authApi';
import { useAuthStore } from '../store/useAuthStore';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<IRegisterInput>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      role: 'customer'
    }
  });

  const selectedRole = watch('role');

  const registerMutation = useMutation({
    mutationFn: registerFn,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.accessToken);
      setUser(data.data.user);
      toast.success('Registration successful! Welcome to FoodDash.');
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  const onSubmit = (data: IRegisterInput) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-surface">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark">Join FoodDash</h1>
            <p className="text-gray-500 mt-2">Create an account to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
              <label className={`flex-1 text-center py-2 rounded-lg cursor-pointer text-sm font-medium transition-all ${selectedRole === 'customer' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-dark'}`}>
                <input type="radio" value="customer" {...register('role')} className="hidden" />
                Customer
              </label>
              <label className={`flex-1 text-center py-2 rounded-lg cursor-pointer text-sm font-medium transition-all ${selectedRole === 'chef' ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-dark'}`}>
                <input type="radio" value="chef" {...register('role')} className="hidden" />
                Chef / Owner
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('name')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name ? 'border-error focus:ring-error' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-surface/50`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-error focus:ring-error' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-surface/50`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password ? 'border-error focus:ring-error' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-surface/50`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-dark transition-colors" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400 hover:text-dark transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.confirmPassword ? 'border-error focus:ring-error' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-surface/50`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary/20 mt-4"
            >
              {registerMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
