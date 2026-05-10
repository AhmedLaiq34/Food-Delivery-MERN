// Shared types used by both client and server

export type UserRole = 'customer' | 'chef' | 'admin';

export type OrderStatus = 'placed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'payment_failed';

export type MealCategory = 'all' | 'breakfast' | 'lunch' | 'dinner';

export type FoodCategory = 'burger' | 'pizza' | 'sandwich' | 'hot_dog' | 'salad' | 'dessert' | 'drinks' | 'other';

export type AddressType = 'home' | 'work' | 'other';

export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type DiscountType = 'percentage' | 'fixed';

export interface IAddress {
  label: AddressType;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  phoneVerified?: boolean;
  bio?: string;
  profilePicture?: string;
  role: UserRole;
  addresses: IAddress[];
  savedCards: ISavedCard[];
  favourites: string[];
  provider?: string;
  providerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISavedCard {
  stripePaymentMethodId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface IRestaurant {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  owner: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  cuisines: string[];
  address: IAddress;
  openingHours: { open: string; close: string };
  createdAt: string;
  updatedAt: string;
}

export interface IMenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurant: string;
  category: FoodCategory;
  mealTime: MealCategory;
  ingredients: string[];
  sizes: { name: string; priceModifier: number }[];
  toppings: { name: string; price: number }[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isSoldOut: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  menuItem: string | IMenuItem;
  quantity: number;
  size?: string;
  toppings?: string[];
  specialInstructions?: string;
  itemTotal: number;
}

export interface ICart {
  _id: string;
  user: string;
  restaurant: string;
  items: ICartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string;
}

export interface IOrder {
  _id: string;
  orderId: string;
  customer: string | IUser;
  restaurant: string | IRestaurant;
  items: ICartItem[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  deliveryAddress: IAddress;
  paymentMethod: 'cod' | 'stripe';
  stripePaymentIntentId?: string;
  isDelivery: boolean;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  user: string | IUser;
  targetType: 'restaurant' | 'menuItem';
  target: string;
  rating: number;
  comment: string;
  reply?: string;
  repliedAt?: string;
  isReported?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPromotion {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountAmount: number;
  minOrderAmount: number;
  maxUsage: number;
  currentUsage: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITransaction {
  _id: string;
  chef: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  bankAccount?: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pages: number;
}
