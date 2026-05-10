# Food Delivery Web Application — MERN Stack
## Combined Project Requirements & Features

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB (with Mongoose) |
| Authentication | JWT + Passport.js |
| Payment | Stripe (test mode) |
| Version Control | Git (GitHub or GitLab) |

---

## Application Scope

Three distinct roles sharing the same backend with full Role-Based Access Control (RBAC):

1. **Customer Application** — End users browsing and ordering food.
2. **Chef/Restaurant Dashboard** — Restaurant owners managing orders and menu.
3. **Admin Dashboard** — System administrators overseeing the platform and managing users.

---

## PART 1: Authentication, Security & Session Management

- All core features implemented correctly; interactive elements respond without errors.
- End-to-end login and signup system including registration, authentication, and session start.
- Passwords hashed using a secure algorithm (bcrypt or Argon2) before storing — plain-text passwords are **never** stored or logged anywhere.
- Password comparison on the backend done securely using hash-comparison functions, never simple string equality.
- Password reset flow implemented securely using a token-based, time-limited link sent via email.
- Functional login/logout with correct session handling and cookie use (e.g., remember-me with JWT refresh tokens).
- Session must expire after inactivity; re-login required for sensitive actions.
- Email/Password registration and login with real-time validation:
  - Minimum 8 characters, uppercase, lowercase, number, and special character.
  - Password strength indicator on the client side.
- Phone verification with 6-digit OTP and 50-second resend timer.
- Social authentication: **Google, Facebook, Twitter** (all three required via Passport.js strategies).
- Protected routes for authenticated users.

---

## PART 2: Navigation, Layout & Customer-Facing UI

### Navigation & Structure

- Working, sticky, and responsive navbar present on every page.
- All links must be accessible with no broken routes.
- Dropdown menus, breadcrumbs, or site search incorporated for better navigation.
- Logical page hierarchy (Home, About, Contact, etc.) with smooth user flow between pages.
- Clean, consistent layout using uniform colors, fonts, and spacing throughout.
- Responsive design ensuring the layout adapts correctly on desktop, tablet, and mobile (mobile-first).
- Footer present on all pages containing contact info, social links, and a copyright notice.
- Page transitions using Framer Motion or CSS transitions.
- Loading skeletons for all data-fetching states.
- Success/failure animations using Lottie or CSS.
- Consistent color theme: Primary `#FF7A2F`, Dark `#2D2D3A`.

### Home, Search & Discovery

- Personalized greeting with user's name and time-based message (Morning / Afternoon / Evening).
- Delivery location display with dropdown to switch between saved addresses.
- Real-time search with debouncing (300 ms), filtering across restaurants, dishes, and cuisines.
- Recent search keywords tracked and stored in MongoDB.
- Suggested restaurants based on order history and user behavior.
- Category filtering via horizontal scrollable chips: All, Hot Dog, Burger, Pizza, etc.
- Restaurant cards displaying: image, rating, delivery badge, estimated time, open/closed status.
- Popular items carousel with "See All" functionality.
- Pagination — load 10 results at a time with infinite scroll or a load-more button.
- Original, relevant, and well-written content across all pages.

### Restaurant Details & Menu

- Restaurant header: cover image, name, rating, delivery info, open/closed status.
- Category-based menu tabs (Burger, Sandwich, Pizza, etc.) with item counts.
- Menu item cards: image, name, price, rating, and Add to Cart button.
- Item detail modal/page:
  - Size selection (e.g., 10", 14", 16").
  - Quantity controls.
  - Ingredient/topping multi-select.
  - Pick-up vs. Delivery toggle.
  - Real-time price calculation.

---

## PART 3: Cart, Checkout & Payment

### Shopping Cart

- Quantity adjustment per item; item removal.
- Real-time subtotal, delivery fee, tax, and discount calculation.
- Empty cart state with illustration.
- Cart persisted in MongoDB per user session.
- Checkout flow with delivery address confirmation and edit option.

### Promotional Offers

- "Hurry Offers!" modal with coupon code display.
- Promo code input at checkout with dynamic cart total update.
- Server-side validation enforcing: expiry date, usage limit, and minimum order amount.
- Discount calculation: percentage or fixed amount.

### Payment Integration (Functional — Not a Mockup)

- Multiple payment methods: Cash on Delivery, Visa, Mastercard, PayPal.
- Saved card display (masked: `•••• •••• •••• 4321`).
- Add card form with validation:
  - Cardholder name, 16-digit card number with auto-formatting, expiry date (MM/YYYY), CVC.
- Luhn algorithm validation for card numbers (client-side).
- **Stripe integration in test mode** — must actually process payments.
- Payment success/failure handling.
- Store only Stripe payment tokens in MongoDB; **never raw card data**.
- Webhook endpoint for Stripe payment events (`POST /api/payments/webhook`).

---

## PART 4: Order Flow, History & User Profile

### Order Confirmation & Status

- Success animation (Lottie or Framer Motion).
- Order status progression: Placed → Preparing → Out for Delivery → Delivered.
- ETA display.
- Order status updates via polling or Socket.io, reflected to customer in real time.

### Order History

- Tabs: **Ongoing** / **History**.
- Filter by: Food/Drink, Completed/Cancelled.
- Order cards: restaurant image, name, order ID, price, date/time, item count.
- Action buttons based on status: Rate, Re-Order, Cancel.
- Pagination for the History tab.

### User Profile & Settings

- Profile picture upload with preview.
- Edit profile: name, email, phone, bio — all with validation.
- Address management: Add / Edit / Delete addresses (Home, Work, Other).
- Navigation sections: Personal Info, Saved Addresses, Cart, Favourites, Payment Methods, FAQs, My Reviews, Settings, Logout.
- Profile data synced with MongoDB.

---

## PART 5: Chef/Restaurant Dashboard

### Dashboard Overview

- Header with profile picture.
- Order statistics: Running Orders count, New Order Requests count.
- Total revenue display with daily revenue graph (line/area chart using Chart.js or Recharts).
- Overall rating display (e.g., 4.9 ⭐) with review count and link to all reviews.
- Popular items section showing the most-ordered items in the past 7 days.
- Sidebar/top navigation: Dashboard, Orders, Menu, Reviews, Profile, Wallet.

### Order Management

- Order list with meal-time tags: Breakfast / Lunch / Dinner.
- Order cards: dish name, time placed, price, customer info.
- Accept ("Done") and Reject ("Cancel") buttons per order.
- Order status updates reflected to the customer.
- Mark order as "Ready for Delivery".

### Menu Management

- Food list with tabs: All, Breakfast, Lunch, Dinner.
- Item cards: image, name, category, price, rating, review count.
- Three-dot menu per item: Edit, Delete, Mark as Sold Out.
- Add/Edit item form: name, description, category, price, photo upload, ingredient/topping multi-select, availability toggle.

### Reviews

- Review cards: customer photo, name, date, star rating, comment.
- Reply to review functionality.
- Report inappropriate review option.
- Average rating auto-calculated on the backend via MongoDB aggregation pipeline.

### Wallet System

- Available balance display.
- Withdraw functionality: amount input, bank account selection.
- Withdrawal success modal with animation.
- Transaction history: date, amount, type, status.
- MongoDB `transactions` collection.

---

## PART 6: Admin Dashboard

- Accessible **exclusively** to the admin role; regular users are redirected or shown a 403 error on attempted access.
- User management: view full user list, activate/deactivate accounts, change user roles.
- Frontend navigation dynamically changes based on the logged-in user's role (e.g., admins see extra menu items and controls).
- Backend routes protected with middleware/guards that verify the role before processing requests.

---

## PART 7: Backend API & Database

### Authentication Endpoints

- JWT-based authentication with access + refresh tokens.
- Email/Password login and registration.
- Phone OTP send and verify endpoints (Twilio or similar).
- Social OAuth: Google, Facebook, Twitter (Passport.js strategies).
- Password reset via email token.

### MongoDB Collections & Schema

| Collection | Key Fields |
|---|---|
| `users` | profile info, addresses, saved card tokens, role (customer / chef / admin) |
| `restaurants` | name, images, ratings, hours, owner reference |
| `menuItems` | name, description, price, category, images, ingredients, availability |
| `orders` | customer, restaurant, items, status, payment, timestamps |
| `carts` | user reference, items, totals (persisted) |
| `reviews` | user, restaurant/item reference, rating, comment, reply |
| `promotions` | code, discount type/amount, expiry, usage limit, min order |
| `transactions` | chef wallet transactions, amount, status, date |

### REST API Endpoints

- Full CRUD for: users, restaurants, menu items, orders, cart, reviews, promotions.
- Stripe webhook endpoint: `POST /api/payments/webhook`.
- OTP send and verify endpoints.
- Image upload endpoints.

### Security

- Input validation and sanitization (express-validator or Joi).
- Helmet.js for HTTP security headers.
- CORS configuration.
- Role-based access control middleware: customer / chef / admin.
- All secrets stored in environment variables — **never hardcoded**.

---

## PART 8: Form Validation

- Email regex validation (client and server).
- Phone number formatting.
- Password strength indicator (client-side).
- Credit card Luhn algorithm validation (client-side).
- Clear, inline error messages for invalid or missing inputs.
- Server-side validation and sanitization for all inputs before processing.

---

## PART 9: Performance & Optimization

- Pages must load quickly with minimal unnecessary scripts or stylesheets.
- Images and assets must be optimized.
- Data processing fully functional; all database CRUD operations and API integrations work correctly.

---

## PART 10: Git Version Control

- Repository appropriately initialized and structured.
- A minimum of **10 meaningful commits** reflecting incremental development progress.
- Consistent commit message convention: `feat:`, `fix:`, `docs:`, etc.

---

## PART 11: Design & Creativity

- Effective use of images, icons, illustrations, or multimedia to enhance the design.
- Unique or innovative concept that goes beyond a generic template or tutorial.
- High visual design quality: color palette, typography, whitespace, and overall aesthetic polish.
- Strong creative impression: layout creativity, theme consistency, and user delight.

---

## PART 12: Documentation & Presentation

- A `README.md` or project report included with a clear explanation of features and setup steps.
