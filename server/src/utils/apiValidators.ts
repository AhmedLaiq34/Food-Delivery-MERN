import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
    profilePicture: z.string().url().optional(),
  }),
});

export const addAddressSchema = z.object({
  body: z.object({
    label: z.enum(['home', 'work', 'other']),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
    isDefault: z.boolean().optional(),
  }),
});

export const restaurantSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    coverImage: z.string().url(),
    deliveryTime: z.string(),
    deliveryFee: z.number().min(0),
    cuisines: z.array(z.string()).min(1),
    address: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      zipCode: z.string().min(1),
      country: z.string().min(1),
    }),
    openingHours: z.object({
      open: z.string(),
      close: z.string(),
    }),
  }),
});

export const menuItemSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string(),
    price: z.number().positive(),
    image: z.string().url(),
    category: z.enum(['burger', 'pizza', 'sandwich', 'hot_dog', 'salad', 'dessert', 'drinks', 'other']),
    mealTime: z.enum(['all', 'breakfast', 'lunch', 'dinner']).optional(),
    ingredients: z.array(z.string()).optional(),
  }),
});
