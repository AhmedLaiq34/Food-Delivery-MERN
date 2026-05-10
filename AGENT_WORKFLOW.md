# Food Delivery MERN — Master Agent Workflow

> **Every agent working on this project MUST read this document first.**
> This is the single source of truth for architecture decisions, implementation order, coding conventions, skill usage, and context handoff protocol.

---

## 0. Quick Reference

| Item | Value |
|---|---|
| Project | Food Delivery Web App (MERN) |
| Requirements | `requirements.md` |
| Skills Registry | `my-agent-project/skills.md` |
| Skills Root | `my-agent-project/.agents/skills/` |
| Primary Color | `#FF7A2F` |
| Dark Color | `#2D2D3A` |
| Node version | 20 LTS |
| Package manager | npm |

---

## 1. Architecture Overview

```
/
├── client/          ← React 18 + Vite + TailwindCSS + shadcn/ui
├── server/          ← Node.js + Express + Mongoose
├── shared/          ← TypeScript types/enums shared by both sides
├── AGENT_WORKFLOW.md  ← this file
└── requirements.md
```

### Tech Decisions (locked — do not deviate without updating this file)

| Concern | Choice | Rationale |
|---|---|---|
| Frontend framework | React 18 (Vite) | Requirements specify React |
| Styling | TailwindCSS + shadcn/ui | Utility-first, accessible components |
| State management | Zustand | Lightweight, avoids Redux boilerplate |
| Data fetching | TanStack Query v5 | Caching, background refetch, loading states |
| Animations | Framer Motion | Required by spec |
| Backend | Node.js + Express | Requirements specify |
| ORM | Mongoose | Requirements specify MongoDB |
| Auth | JWT (access + refresh) + Passport.js | Requirements specify |
| Payment | Stripe (test mode) | Requirements specify |
| Real-time | Socket.io | Order status updates |
| OTP | Twilio | Phone verification |
| Email | Nodemailer (or SendGrid) | Password reset |
| Validation (server) | Zod | Schema-first, TypeScript-friendly |
| Validation (client) | React Hook Form + Zod | Same schemas reused |
| HTTP security | Helmet.js | Requirements specify |
| Image upload | Multer + Cloudinary | Persistent storage |

---

## 2. Skill Usage Map

Every agent must consult the relevant skill before implementing. Skill files live at `my-agent-project/.agents/skills/<skill-name>/SKILL.md`.

### Phase → Skill Bindings

| Phase / Feature | Primary Skill(s) | Secondary Skill(s) |
|---|---|---|
| Project setup & scaffolding | `senior-fullstack`, `backend-patterns` | `environment-setup-guide`, `docker-expert` |
| Folder structure & monorepo | `monorepo-architect`, `monorepo-management` | `coding-standards` |
| MongoDB schemas | `database-design`, `database-architect` | `nosql-expert` |
| Express API design | `api-design`, `api-design-principles` | `api-endpoint-builder`, `nodejs-backend-patterns` |
| JWT + Passport auth | `auth-implementation-patterns`, `broken-authentication` | `security-audit`, `jwt` |
| Social OAuth (Google/FB/Twitter) | `auth-implementation-patterns` | `passport` (covered in auth skill) |
| Password hashing & reset | `auth-implementation-patterns`, `security-audit` | `secrets-management` |
| Phone OTP (Twilio) | `twilio-communications` | `auth-implementation-patterns` |
| RBAC middleware | `backend-security-coder`, `api-security-best-practices` | `auth-implementation-patterns` |
| Input validation (server) | `zod-validation-expert` | `api-security-best-practices` |
| Security hardening | `security-scanning-security-hardening`, `api-security-best-practices` | `harden`, `security-audit` |
| React project setup | `react-best-practices`, `react-patterns` | `frontend-dev-guidelines` |
| Component library | `shadcn`, `ui-component` | `radix-ui-design-system` |
| TailwindCSS design system | `tailwind-patterns`, `tailwind-design-system` | `ui-tokens` |
| Routing (React Router v6) | `react-best-practices` | `frontend-patterns` |
| State management (Zustand) | `zustand-store-ts` | `react-state-management` |
| Data fetching (TanStack Query) | `tanstack-query-expert` | `react-patterns` |
| Forms + validation | `zod-validation-expert`, `react-best-practices` | `form-cro` |
| Animations (Framer Motion) | `animejs-animation`, `animate` | `magic-animator` |
| Loading skeletons | `ui-component`, `ui-page` | `frontend-patterns` |
| Responsive / mobile-first | `mobile-design`, `frontend-patterns` | `ui-ux-pro-max` |
| Navbar, footer, layout | `ui-page`, `layout` | `ui-component` |
| Home page / search | `react-patterns`, `tanstack-query-expert` | `ui-page` |
| Restaurant & menu pages | `react-patterns`, `ui-component` | `ui-page` |
| Shopping cart | `zustand-store-ts`, `react-patterns` | `ui-component` |
| Checkout & promo codes | `react-patterns`, `tanstack-query-expert` | `zod-validation-expert` |
| Stripe payment integration | `stripe-integration`, `payment-integration` | `pci-compliance` |
| Order status + Socket.io | `react-patterns` | `nodejs-backend-patterns` |
| Order history | `tanstack-query-expert`, `ui-page` | `react-patterns` |
| User profile & settings | `react-patterns`, `ui-component` | `file-uploads` |
| Image upload | `file-uploads` | `backend-patterns` |
| Chef dashboard | `react-patterns`, `ui-page` | `ui-component` |
| Charts (Recharts) | `react-patterns` | `ui-component` |
| Menu management (CRUD) | `react-patterns`, `tanstack-query-expert` | `ui-component` |
| Reviews & ratings | `react-patterns`, `ui-component` | `database-design` |
| Wallet & transactions | `react-patterns`, `database-design` | `stripe-integration` |
| Admin dashboard | `react-patterns`, `ui-page` | `ui-component` |
| Error handling (global) | `error-handling-patterns` | `debugging-strategies` |
| End-to-end testing | `e2e-testing`, `playwright-skill` | `testing-qa` |
| Git conventions | `git-pr-workflows-git-workflow` | `commit` |
| README / docs | `documentation`, `readme` | `docs` |
| Performance optimization | `performance-optimizer`, `web-performance-optimization` | `react-component-performance` |
| Security final audit | `security-review`, `security-audit` | `cc-skill-security-review` |

---

## 3. Implementation Phases

Execute phases in order. Do not start a later phase until the prior phase's acceptance criteria are met.

---

### Phase 0 — Environment & Repository Setup

**Goal:** A runnable empty project shell with all tooling wired up.

**Skills:** `environment-setup-guide`, `monorepo-architect`, `coding-standards`

#### Steps

1. Init root `package.json` with workspaces:
   ```json
   { "workspaces": ["client", "server"] }
   ```
2. Scaffold `server/` (Express + TypeScript):
   ```
   server/
   ├── src/
   │   ├── config/          env vars, db connection
   │   ├── controllers/
   │   ├── middleware/
   │   ├── models/
   │   ├── routes/
   │   ├── services/
   │   ├── utils/
   │   └── index.ts         Express app entry
   ├── package.json
   └── tsconfig.json
   ```
3. Scaffold `client/` (Vite + React + TypeScript):
   ```
   client/
   ├── src/
   │   ├── assets/
   │   ├── components/      shared/reusable components
   │   ├── pages/
   │   ├── hooks/
   │   ├── store/           Zustand stores
   │   ├── services/        API call functions
   │   ├── utils/
   │   ├── types/
   │   ├── lib/             shadcn init output
   │   └── main.tsx
   ├── index.html
   ├── package.json
   ├── tailwind.config.ts
   └── tsconfig.json
   ```
4. Create `shared/types/` directory with shared TypeScript interfaces for User, Order, MenuItem, etc.
5. Set up `.env.example` in root with ALL required variables (see §8 Environment Variables).
6. Configure `eslint`, `prettier`, and `husky` pre-commit hooks.
7. Initialize git repo in root; create `main` branch; make first commit `init: scaffold monorepo`.

**Acceptance Criteria:**
- `npm run dev` in `server/` starts Express on port 5000
- `npm run dev` in `client/` starts Vite on port 3000
- No TypeScript errors
- ESLint passes

---

### Phase 1 — Database Models & Mongoose Schemas

**Goal:** All MongoDB collections defined with correct schemas and indexes.

**Skills:** `database-design`, `database-architect`, `nosql-expert`

#### Collections to Define (in `server/src/models/`)

| File | Collection | Key Constraints |
|---|---|---|
| `User.ts` | `users` | role enum: `customer\|chef\|admin`; password never returned in queries |
| `Restaurant.ts` | `restaurants` | owner ref to User; rating auto-calc via aggregation |
| `MenuItem.ts` | `menuItems` | restaurant ref; category enum |
| `Order.ts` | `orders` | status enum: `placed\|preparing\|out_for_delivery\|delivered\|cancelled` |
| `Cart.ts` | `carts` | one doc per user; embedded items array |
| `Review.ts` | `reviews` | polymorphic target (restaurant or menuItem) |
| `Promotion.ts` | `promotions` | expiry, usageLimit, minOrderAmount enforced |
| `Transaction.ts` | `transactions` | chef wallet; type enum: `credit\|debit` |
| `OTP.ts` | `otps` | TTL index: 600 seconds |
| `RefreshToken.ts` | `refreshTokens` | TTL index: 7 days |

#### Conventions
- All schemas: `{ timestamps: true }` (createdAt/updatedAt automatic)
- All `_id` fields: use default ObjectId
- Sensitive fields (password, cardToken): `select: false` in schema
- Add compound indexes for frequent query patterns (e.g., `{ restaurant: 1, category: 1 }` on MenuItem)
- No plain-text password ever stored — see Phase 2

**Acceptance Criteria:**
- All models compile with no TypeScript errors
- `db:seed` script populates sample data for each collection
- Mongoose connection success log appears on server start

---

### Phase 2 — Authentication & Security

**Goal:** Complete auth system: register, login, JWT, refresh tokens, social OAuth, OTP, password reset.

**Skills:** `auth-implementation-patterns`, `security-audit`, `zod-validation-expert`, `twilio-communications`, `secrets-management`

#### Sub-tasks

**2a. Email/Password Auth**
- `POST /api/auth/register` — validate with Zod, hash password with bcrypt (cost factor 12), issue access + refresh tokens
- `POST /api/auth/login` — verify hash with `bcrypt.compare` (never `===`), rotate refresh token on each login
- `POST /api/auth/logout` — invalidate refresh token in DB
- `POST /api/auth/refresh` — validate refresh token, issue new access token
- Access token: 15-min expiry, signed with `process.env.JWT_ACCESS_SECRET`
- Refresh token: 7-day expiry, stored in `refreshTokens` collection and sent via HttpOnly cookie

**2b. Password Reset**
- `POST /api/auth/forgot-password` — generate a cryptographically secure token (`crypto.randomBytes(32)`), store hash in DB with 1-hour expiry, email link
- `POST /api/auth/reset-password/:token` — validate token, update password, invalidate all refresh tokens for user

**2c. Phone OTP**
- `POST /api/auth/otp/send` — generate 6-digit code, store hashed in `otps` (TTL 600s), send via Twilio
- `POST /api/auth/otp/verify` — verify hash, mark phone as verified

**2d. Social OAuth (Passport.js)**
- Strategies: `passport-google-oauth20`, `passport-facebook`, `passport-twitter`
- On success: upsert user by email/provider ID, issue JWT pair
- Callback routes: `/api/auth/google/callback`, `/api/auth/facebook/callback`, `/api/auth/twitter/callback`

**2e. RBAC Middleware**
- `authenticate` middleware: verify access JWT, attach `req.user`
- `authorize(...roles)` middleware: check `req.user.role` against allowed roles
- Apply to all protected routes

**Security Rules (non-negotiable)**
- Passwords: bcrypt only, cost factor ≥ 12, `select: false` on schema field
- Tokens: HttpOnly + Secure + SameSite=Strict cookies for refresh tokens
- Secrets: ALL in `process.env`, never hardcoded
- Helmet.js applied globally on the Express app
- CORS: whitelist only the client origin from env

**Acceptance Criteria:**
- Registration fails if password < 8 chars or missing uppercase/lowercase/number/special
- Login returns 401 for wrong credentials (generic error, no user enumeration)
- Protected route returns 401 without token, 403 for wrong role
- Social OAuth redirects correctly and creates/updates user record

---

### Phase 3 — Core REST API

**Goal:** All CRUD endpoints for every resource.

**Skills:** `api-design`, `api-endpoint-builder`, `nodejs-backend-patterns`, `zod-validation-expert`, `api-security-best-practices`

#### Route Groupings (`server/src/routes/`)

```
auth.routes.ts       — /api/auth/*
users.routes.ts      — /api/users/*
restaurants.routes.ts — /api/restaurants/*
menu.routes.ts       — /api/menu/*
orders.routes.ts     — /api/orders/*
cart.routes.ts       — /api/cart/*
reviews.routes.ts    — /api/reviews/*
promotions.routes.ts — /api/promotions/*
transactions.routes.ts — /api/transactions/*
payments.routes.ts   — /api/payments/* (includes webhook)
uploads.routes.ts    — /api/uploads/*
```

#### Conventions for Every Route
- Validate request body/params/query with Zod schema before controller runs
- Controllers are thin: extract validated data, call service, return response
- Services contain business logic; models contain data access
- Errors thrown with a custom `AppError(message, statusCode)` class
- Global error handler middleware formats all errors as `{ success: false, message, errors? }`
- Pagination: all list endpoints accept `?page=1&limit=10`; response includes `{ data, total, page, pages }`
- Image fields: store only Cloudinary URL, never base64

#### Role-Access Matrix

| Route group | customer | chef | admin |
|---|---|---|---|
| Browse restaurants/menu | ✓ | ✓ | ✓ |
| Place/cancel own orders | ✓ | — | — |
| Manage restaurant/menu | — | ✓ own | ✓ all |
| Accept/reject orders | — | ✓ own | ✓ all |
| User management | — | — | ✓ |
| Promotions CRUD | — | — | ✓ |

**Acceptance Criteria:**
- All endpoints return correct HTTP status codes
- Validation errors return 400 with field-level messages
- Unauthorized access returns 401/403
- Postman collection or OpenAPI spec generated

---

### Phase 4 — File Uploads & Image Management

**Goal:** Profile pictures, menu item images, restaurant cover images uploaded and stored.

**Skills:** `file-uploads`, `backend-patterns`

- Multer middleware for `multipart/form-data`
- Cloudinary SDK for upload; store returned URL in MongoDB document
- Max file size: 5 MB; allowed MIME: `image/jpeg`, `image/png`, `image/webp`
- Server deletes temp file after upload (Multer `memoryStorage`)
- Client: `<input type="file">` with preview before upload

---

### Phase 5 — Payment Integration (Stripe)

**Goal:** Functional Stripe payment, not a mockup.

**Skills:** `stripe-integration`, `payment-integration`, `pci-compliance`

#### Sub-tasks

**5a. Payment Intent**
- `POST /api/payments/intent` — create Stripe PaymentIntent for the order total, return `clientSecret`
- Client confirms payment with Stripe.js (`stripe.confirmCardPayment`)

**5b. Webhook**
- `POST /api/payments/webhook` — raw body parser, verify Stripe signature with `stripe.webhooks.constructEvent`
- Handle: `payment_intent.succeeded` → update order status to `preparing`
- Handle: `payment_intent.payment_failed` → mark order as `payment_failed`

**5c. Saved Cards**
- Store Stripe `PaymentMethod.id` and last4/brand in user document (never raw card data)
- Display masked: `•••• •••• •••• 4321`

**5d. Client-side**
- Luhn algorithm validation before submitting card number to Stripe
- `@stripe/react-stripe-js` Elements for PCI-compliant card input

**Non-negotiable security:**
- Raw card data NEVER touches your server
- Only Stripe tokens/IDs stored in MongoDB
- Webhook endpoint uses raw body, not JSON-parsed

---

### Phase 6 — Real-time (Socket.io)

**Goal:** Order status updates pushed to customer in real time.

**Skills:** (use `nodejs-backend-patterns` + `react-patterns` — no dedicated skill, compose from these)

- Server: Socket.io attached to same HTTP server as Express
- On order status change, emit `order:status_update` to room `order:<orderId>`
- Client: join room on Order Tracking page; update UI on event receipt
- Fallback: polling every 30s if Socket not connected

---

### Phase 7 — Frontend: Layout & Shared Components

**Goal:** App shell, routing, navbar, footer, loading skeletons, theme.

**Skills:** `react-best-practices`, `ui-page`, `ui-component`, `tailwind-patterns`, `shadcn`, `animejs-animation`

#### Theme (lock these values)
```ts
// tailwind.config.ts
colors: {
  primary: '#FF7A2F',
  dark: '#2D2D3A',
}
```

#### Shared Components to Build First
- `Navbar` — sticky, responsive, role-aware links
- `Footer` — contact info, social links, copyright
- `ProtectedRoute` — wraps pages requiring auth, redirects to login
- `RoleRoute` — wraps pages requiring a specific role
- `Skeleton` — reusable loading skeleton with shimmer animation
- `PageTransition` — Framer Motion wrapper for route transitions
- `ErrorBoundary` — catches render errors, shows fallback UI
- `Toast` / `Notification` — success/failure feedback (use shadcn `Sonner`)
- `Modal` — accessible dialog via shadcn `Dialog`
- `PasswordStrengthIndicator` — visual strength bar on register/reset forms

#### Routing Structure (`client/src/pages/`)
```
/                    → HomePage
/login               → LoginPage
/register            → RegisterPage
/forgot-password     → ForgotPasswordPage
/reset-password/:token → ResetPasswordPage
/restaurants         → RestaurantsPage
/restaurants/:id     → RestaurantDetailPage
/cart                → CartPage
/checkout            → CheckoutPage
/order/:id           → OrderTrackingPage
/orders              → OrderHistoryPage
/profile             → ProfilePage
/chef/               → ChefDashboardPage (role=chef)
/chef/orders         → ChefOrdersPage
/chef/menu           → ChefMenuPage
/chef/reviews        → ChefReviewsPage
/chef/wallet         → ChefWalletPage
/admin/              → AdminDashboardPage (role=admin)
/admin/users         → AdminUsersPage
*                    → NotFoundPage
```

---

### Phase 8 — Customer-Facing Pages

**Goal:** All customer UI pages functional and connected to real API.

**Skills:** `react-patterns`, `tanstack-query-expert`, `ui-page`, `ui-component`, `zustand-store-ts`

#### Page-by-Page Checklist

**HomePage**
- [ ] Personalized greeting with time-of-day (Morning/Afternoon/Evening)
- [ ] Delivery location switcher (dropdown with saved addresses)
- [ ] Search bar with 300ms debounce using `useDebounce` hook
- [ ] Recent search keywords (stored in MongoDB via API)
- [ ] Category filter chips (horizontal scroll): All, Hot Dog, Burger, Pizza, etc.
- [ ] Restaurant cards: image, rating, delivery badge, ETA, open/closed
- [ ] Popular items carousel with "See All"
- [ ] Infinite scroll or load-more (10 per page)
- [ ] Loading skeletons for all async data

**RestaurantDetailPage**
- [ ] Cover image, name, rating, delivery info, open/closed badge
- [ ] Menu category tabs with item counts
- [ ] Menu item cards: image, name, price, rating, Add to Cart
- [ ] Item detail modal: size selection, quantity, toppings multi-select, pickup/delivery toggle, real-time price

**CartPage**
- [ ] Item list with quantity +/- and remove
- [ ] Real-time subtotal, delivery fee (flat or distance-based), tax (configurable %), discount
- [ ] Empty cart illustration state
- [ ] Promo code input with server validation
- [ ] "Proceed to Checkout" button

**CheckoutPage**
- [ ] Delivery address confirmation/edit
- [ ] Payment method selection: COD, Stripe (Visa/Mastercard), PayPal
- [ ] Saved card display with masked number
- [ ] Add new card form (Luhn validation, Stripe Elements)
- [ ] Order summary sidebar
- [ ] Place Order → payment → success animation

**OrderTrackingPage**
- [ ] Status stepper: Placed → Preparing → Out for Delivery → Delivered
- [ ] ETA display
- [ ] Real-time update via Socket.io

**OrderHistoryPage**
- [ ] Tabs: Ongoing / History
- [ ] Filter: Food/Drink, Completed/Cancelled
- [ ] Order cards with action buttons (Rate, Re-Order, Cancel)
- [ ] Pagination on History tab

**ProfilePage**
- [ ] Profile picture upload with preview
- [ ] Edit name, email, phone, bio (all validated)
- [ ] Address management: Add/Edit/Delete (Home/Work/Other)
- [ ] Navigation links to cart, favourites, payment methods, FAQs, reviews, settings

---

### Phase 9 — Chef Dashboard

**Goal:** Restaurant owner management interface.

**Skills:** `react-patterns`, `ui-page`, `ui-component`, `tanstack-query-expert`

#### Pages Checklist

**ChefDashboardPage**
- [ ] Running orders count, new order requests count
- [ ] Revenue display + daily revenue line/area chart (Recharts)
- [ ] Overall rating with review count
- [ ] Popular items (past 7 days)
- [ ] Sidebar: Dashboard, Orders, Menu, Reviews, Profile, Wallet

**ChefOrdersPage**
- [ ] Order list with meal-time tags (Breakfast/Lunch/Dinner based on time placed)
- [ ] Order cards: dish, time, price, customer info
- [ ] Accept ("Done") / Reject ("Cancel") buttons per order
- [ ] Mark as "Ready for Delivery"
- [ ] Real-time new order notifications via Socket.io

**ChefMenuPage**
- [ ] Food list tabs: All, Breakfast, Lunch, Dinner
- [ ] Item cards: image, name, category, price, rating, review count
- [ ] Three-dot menu: Edit, Delete, Mark as Sold Out
- [ ] Add/Edit item form: all fields, photo upload, ingredient multi-select, availability toggle

**ChefReviewsPage**
- [ ] Review cards: customer photo, name, date, star rating, comment
- [ ] Reply to review
- [ ] Report inappropriate review

**ChefWalletPage**
- [ ] Available balance
- [ ] Withdraw form: amount + bank account selection
- [ ] Withdrawal success animation
- [ ] Transaction history with pagination

---

### Phase 10 — Admin Dashboard

**Goal:** Platform administration, accessible only to admin role.

**Skills:** `react-patterns`, `ui-page`, `ui-component`

- [ ] Route guard: non-admin users see 403 page
- [ ] User list: activate/deactivate accounts, change roles
- [ ] Platform-level stats (total orders, revenue, restaurants)
- [ ] Navigation adapts to role (admin sees extra controls)
- [ ] Backend routes double-protected: `authenticate` + `authorize('admin')`

---

### Phase 11 — Testing

**Goal:** Core flows covered by tests.

**Skills:** `e2e-testing`, `playwright-skill`, `testing-qa`, `javascript-testing-patterns`

- Unit tests for: auth middleware, Zod schemas, Stripe webhook handler, Luhn algorithm
- Integration tests for: auth endpoints, order lifecycle, cart CRUD
- E2E tests (Playwright): register → browse → add to cart → checkout → order tracking
- Test coverage target: ≥ 70% on server-side business logic

---

### Phase 12 — Performance & Security Hardening

**Goal:** App is fast and secure before final submission.

**Skills:** `performance-optimizer`, `web-performance-optimization`, `security-scanning-security-hardening`, `security-review`, `react-component-performance`

- [ ] Images lazy-loaded, served via Cloudinary transformations (WebP, resized)
- [ ] React.lazy + Suspense for route-level code splitting
- [ ] TanStack Query caching eliminates redundant API calls
- [ ] Lighthouse score ≥ 80 on Performance, Accessibility, Best Practices
- [ ] `npm audit` — zero critical vulnerabilities
- [ ] Express rate limiting on auth endpoints (express-rate-limit)
- [ ] MongoDB query analysis (`explain()`) on frequent queries
- [ ] Environment variable audit: no secrets in client bundle

---

### Phase 13 — Git, Docs & Final Polish

**Goal:** Clean commit history, README, and final review.

**Skills:** `git-pr-workflows-git-workflow`, `commit`, `readme`, `documentation`

- Minimum 10 meaningful commits with conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)
- `README.md` in root: project description, setup steps, env variables, available scripts
- All console.logs removed or replaced with a proper logger (winston or pino)
- No TODO comments left in code

---

## 4. Coding Conventions (enforced by all agents)

### General
- **TypeScript everywhere** — `strict: true` in all tsconfig files
- **No `any` type** — use `unknown` then narrow, or define proper types
- **Shared types** live in `shared/types/` — import from there in both client and server
- **No hardcoded strings** for API routes — use a constants file

### Server
- Controller functions: named exports, not default
- Each controller file: one resource (e.g., `order.controller.ts`)
- Async route handlers always wrapped with `catchAsync(fn)` utility (avoids try/catch repetition)
- Error responses always via `next(new AppError(msg, code))`
- Never return `res.status(200).json({ success: false })` — use proper HTTP codes

### Client
- Components: PascalCase filenames and function names
- Hooks: camelCase with `use` prefix
- One component per file
- Zustand stores: one file per domain (`useCartStore.ts`, `useAuthStore.ts`)
- API calls: all in `client/src/services/` (never fetch inline in components)
- `useQuery` / `useMutation` from TanStack Query for all server state
- Local UI state only with `useState` (not Zustand)
- No inline styles — Tailwind classes only

### Git
- Branch naming: `feat/short-description`, `fix/short-description`
- Never commit directly to `main`
- Commit messages: `type(scope): description` — e.g., `feat(auth): add google oauth`

---

## 5. Context Handoff Protocol

When one agent hands off to another, the incoming agent MUST receive:

### Handoff Checklist
- [ ] Current phase number from §3
- [ ] List of completed acceptance criteria
- [ ] List of in-progress or blocked tasks
- [ ] Any deviations from this document (with reason)
- [ ] Files modified in the last session (relative paths)
- [ ] Any new environment variables added (with description, not values)
- [ ] Any open decisions that need resolution

### Handoff Template
```
## Handoff — Phase <N>
Date: <ISO date>
Agent completing: <model/session>

### Completed
- <list>

### In Progress
- <list with blockers if any>

### Files Changed
- <relative paths>

### New Env Vars
- <VAR_NAME>: <description>

### Open Decisions
- <question>: <options considered>

### Next Steps
- <what the incoming agent should start with>
```

---

## 6. Environment Variables Reference

Create `server/.env` from `server/.env.example`. Never commit `.env`.

```bash
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/food_delivery

# JWT
JWT_ACCESS_SECRET=<min 32 char random string>
JWT_REFRESH_SECRET=<min 32 char random string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Twilio (OTP)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Email (password reset)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@fooddelivery.com

# Social OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
TWITTER_API_KEY=
TWITTER_API_SECRET=
OAUTH_CALLBACK_URL=http://localhost:5000/api/auth
```

Client env (`client/.env`):
```bash
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SOCKET_URL=http://localhost:5000
```

---

## 7. Skills Lookup Reference

To read a skill before implementing a feature:
```
Read: my-agent-project/.agents/skills/<skill-name>/SKILL.md
```

Most-used skills for this project:
- Auth: `my-agent-project/.agents/skills/auth-implementation-patterns/SKILL.md`
- Stripe: `my-agent-project/.agents/skills/stripe-integration/SKILL.md`
- Zod: `my-agent-project/.agents/skills/zod-validation-expert/SKILL.md`
- React: `my-agent-project/.agents/skills/react-best-practices/SKILL.md`
- shadcn: `my-agent-project/.agents/skills/shadcn/SKILL.md`
- Zustand: `my-agent-project/.agents/skills/zustand-store-ts/SKILL.md`
- TanStack Query: `my-agent-project/.agents/skills/tanstack-query-expert/SKILL.md`
- Database: `my-agent-project/.agents/skills/database-design/SKILL.md`
- Security: `my-agent-project/.agents/skills/security-audit/SKILL.md`
- E2E tests: `my-agent-project/.agents/skills/playwright-skill/SKILL.md`
- Tailwind: `my-agent-project/.agents/skills/tailwind-patterns/SKILL.md`
- Twilio: `my-agent-project/.agents/skills/twilio-communications/SKILL.md`
- File uploads: `my-agent-project/.agents/skills/file-uploads/SKILL.md`

---

## 8. Do-Not Rules (all agents must honour)

1. **Never store plain-text passwords** — bcrypt only
2. **Never store raw card data** — Stripe tokens only
3. **Never hardcode secrets** — always `process.env.*`
4. **Never skip Zod validation** before touching the database
5. **Never return a 200 status for errors** — use correct HTTP codes
6. **Never commit `.env` files**
7. **Never use `eval()`, `innerHTML` with user input, or `dangerouslySetInnerHTML`** without sanitization
8. **Never add `console.log` with sensitive data** (tokens, passwords)
9. **Never implement a feature without first reading the mapped skill**
10. **Never deviate from this document's tech decisions** without updating this file and noting the reason

---

## 9. Progress Tracker

Update this section at the end of each session.

| Phase | Status | Last Updated | Notes |
|---|---|---|---|
| 0 — Setup | Not Started | — | |
| 1 — DB Models | Not Started | — | |
| 2 — Auth | Not Started | — | |
| 3 — REST API | Not Started | — | |
| 4 — File Uploads | Not Started | — | |
| 5 — Stripe | Not Started | — | |
| 6 — Socket.io | Not Started | — | |
| 7 — Layout/Shell | Not Started | — | |
| 8 — Customer UI | Not Started | — | |
| 9 — Chef Dashboard | Not Started | — | |
| 10 — Admin Dashboard | Not Started | — | |
| 11 — Testing | Not Started | — | |
| 12 — Performance/Security | Not Started | — | |
| 13 — Git/Docs | Not Started | — | |
