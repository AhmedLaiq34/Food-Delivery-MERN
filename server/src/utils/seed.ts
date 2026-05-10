import mongoose from 'mongoose';
import { config } from '../config';
import { User } from '../models/User';
import { Restaurant } from '../models/Restaurant';
import { MenuItem } from '../models/MenuItem';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(config.mongodbUri);

    console.log('🗑️  Clearing old data...');
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt.hash('Password@123', config.bcryptSaltRounds);

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@fooddash.com',
      password: hashedPassword,
      role: 'admin',
      phoneVerified: true,
      addresses: [],
    });

    const chef1 = await User.create({
      name: 'Gordon Ramsay',
      email: 'gordon@fooddash.com',
      password: hashedPassword,
      role: 'chef',
      phoneVerified: true,
      addresses: [],
    });

    const chef2 = await User.create({
      name: 'Jamie Oliver',
      email: 'jamie@fooddash.com',
      password: hashedPassword,
      role: 'chef',
      phoneVerified: true,
      addresses: [],
    });

    const chef3 = await User.create({
      name: 'Massimo Bottura',
      email: 'massimo@fooddash.com',
      password: hashedPassword,
      role: 'chef',
      phoneVerified: true,
      addresses: [],
    });

    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@fooddash.com',
      password: hashedPassword,
      role: 'customer',
      phoneVerified: true,
      addresses: [
        {
          label: 'home',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true,
        },
      ],
    });

    console.log('🍽️  Creating restaurants...');

    const restaurant1 = await Restaurant.create({
      name: "Hell's Kitchen Burgers",
      description: 'Premium handcrafted burgers made with the finest ingredients. Our signature beef patties are grilled to perfection with gourmet toppings.',
      owner: chef1._id,
      cuisines: ['American', 'Burgers', 'Grill'],
      coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      address: {
        street: '350 W 46th St',
        city: 'New York',
        state: 'NY',
        zipCode: '10036',
        country: 'USA',
      },
      openingHours: { open: '11:00', close: '23:00' },
      deliveryTime: '25-35 min',
      deliveryFee: 3.99,
      rating: 4.7,
      reviewCount: 342,
    });

    const restaurant2 = await Restaurant.create({
      name: "Jamie's Italian Kitchen",
      description: 'Authentic Italian cuisine with a modern twist. Fresh pasta made daily, wood-fired pizzas, and decadent desserts.',
      owner: chef2._id,
      cuisines: ['Italian', 'Pizza', 'Pasta'],
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      address: {
        street: '200 5th Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10010',
        country: 'USA',
      },
      openingHours: { open: '12:00', close: '22:00' },
      deliveryTime: '30-45 min',
      deliveryFee: 4.99,
      rating: 4.5,
      reviewCount: 218,
    });

    const restaurant3 = await Restaurant.create({
      name: 'Sakura Sushi Bar',
      description: 'Experience the art of Japanese cuisine. Fresh sashimi, creative maki rolls, and traditional ramen bowls.',
      owner: chef3._id,
      cuisines: ['Japanese', 'Sushi', 'Ramen'],
      coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      address: {
        street: '85 E 10th St',
        city: 'New York',
        state: 'NY',
        zipCode: '10003',
        country: 'USA',
      },
      openingHours: { open: '11:30', close: '22:30' },
      deliveryTime: '20-30 min',
      deliveryFee: 2.99,
      rating: 4.8,
      reviewCount: 456,
    });

    const restaurant4 = await Restaurant.create({
      name: 'Spice Route',
      description: 'Bold flavors from the Indian subcontinent. Aromatic curries, tandoori specialties, and freshly baked naan.',
      owner: chef1._id,
      cuisines: ['Indian', 'Curry', 'Tandoori'],
      coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      address: {
        street: '120 E 28th St',
        city: 'New York',
        state: 'NY',
        zipCode: '10016',
        country: 'USA',
      },
      openingHours: { open: '11:00', close: '22:00' },
      deliveryTime: '35-50 min',
      deliveryFee: 3.49,
      rating: 4.6,
      reviewCount: 189,
    });

    console.log('🍔 Creating menu items...');

    // Hell's Kitchen Burgers menu
    await MenuItem.insertMany([
      {
        name: 'Classic Smash Burger',
        description: 'Double smashed beef patties, American cheese, pickles, onions, and our signature sauce on a brioche bun.',
        price: 14.99,
        restaurant: restaurant1._id,
        category: 'burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Truffle Mushroom Burger',
        description: 'Wagyu beef patty, sautéed wild mushrooms, truffle aioli, gruyère cheese, and arugula.',
        price: 19.99,
        restaurant: restaurant1._id,
        category: 'burger',
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee15d?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Loaded Fries',
        description: 'Crispy golden fries topped with cheddar cheese sauce, bacon bits, jalapeños, and sour cream.',
        price: 8.99,
        restaurant: restaurant1._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Onion Rings',
        description: 'Beer-battered onion rings served with spicy ketchup.',
        price: 6.99,
        restaurant: restaurant1._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Chocolate Milkshake',
        description: 'Rich and creamy chocolate milkshake made with premium ice cream.',
        price: 7.49,
        restaurant: restaurant1._id,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
    ]);

    // Jamie's Italian Kitchen menu
    await MenuItem.insertMany([
      {
        name: 'Margherita Pizza',
        description: 'San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil on a wood-fired crust.',
        price: 16.99,
        restaurant: restaurant2._id,
        category: 'pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Truffle Carbonara',
        description: 'Fresh spaghetti with guanciale, pecorino romano, black pepper, and a touch of truffle oil.',
        price: 21.99,
        restaurant: restaurant2._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Caprese Salad',
        description: 'Buffalo mozzarella, heirloom tomatoes, fresh basil, balsamic reduction.',
        price: 12.99,
        restaurant: restaurant2._id,
        category: 'salad',
        image: 'https://images.unsplash.com/photo-1608032077018-c9aad9565d29?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.',
        price: 10.99,
        restaurant: restaurant2._id,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
    ]);

    // Sakura Sushi Bar menu
    await MenuItem.insertMany([
      {
        name: 'Dragon Roll',
        description: 'Shrimp tempura roll topped with avocado, eel sauce, and sesame seeds.',
        price: 17.99,
        restaurant: restaurant3._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Salmon Sashimi',
        description: '8 pieces of premium fresh Atlantic salmon, served with wasabi and pickled ginger.',
        price: 15.99,
        restaurant: restaurant3._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Tonkotsu Ramen',
        description: 'Rich pork bone broth, chashu pork, soft-boiled egg, bamboo shoots, and fresh noodles.',
        price: 16.99,
        restaurant: restaurant3._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Edamame',
        description: 'Steamed soybean pods tossed with sea salt.',
        price: 5.99,
        restaurant: restaurant3._id,
        category: 'salad',
        image: 'https://images.unsplash.com/photo-1564093497595-593b96d80571?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Green Tea Mochi',
        description: 'Soft mochi filled with matcha green tea ice cream.',
        price: 8.99,
        restaurant: restaurant3._id,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
    ]);

    // Spice Route menu
    await MenuItem.insertMany([
      {
        name: 'Butter Chicken',
        description: 'Tender chicken in a creamy tomato-butter sauce with aromatic spices. Served with basmati rice.',
        price: 17.99,
        restaurant: restaurant4._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Chicken Tikka Masala',
        description: 'Grilled chicken chunks in a rich, spiced masala gravy with cream.',
        price: 16.99,
        restaurant: restaurant4._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Garlic Naan',
        description: 'Freshly baked naan bread brushed with garlic butter and cilantro.',
        price: 4.99,
        restaurant: restaurant4._id,
        category: 'sandwich',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Samosa (2 pcs)',
        description: 'Crispy pastry filled with spiced potatoes and peas, served with mint chutney.',
        price: 6.99,
        restaurant: restaurant4._id,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
      {
        name: 'Mango Lassi',
        description: 'Sweet and refreshing yogurt drink blended with Alphonso mangoes.',
        price: 5.49,
        restaurant: restaurant4._id,
        category: 'drinks',
        image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
        isAvailable: true,
      },
    ]);

    console.log('');
    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📋 Test Accounts:');
    console.log('   Admin:    admin@fooddash.com    / Password@123');
    console.log('   Chef 1:   gordon@fooddash.com   / Password@123');
    console.log('   Chef 2:   jamie@fooddash.com    / Password@123');
    console.log('   Chef 3:   massimo@fooddash.com  / Password@123');
    console.log('   Customer: customer@fooddash.com / Password@123');
    console.log('');
    console.log('🍽️  Restaurants: 4 restaurants with 19 menu items created');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
