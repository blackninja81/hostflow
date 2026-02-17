# HostFlow - Comprehensive Application Documentation

## Overview

HostFlow is a modern, web-based inventory and property management system designed specifically for short-term rental hosts and property managers. Built with Next.js 16, TypeScript, and Supabase, it provides a comprehensive solution for tracking inventory levels, managing guest bookings, and monitoring financial performance across multiple properties.

**Tagline**: "The Airbnb for Inventory Management"

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript with React 19
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks (useState, useMemo)
- **PDF Generation**: jsPDF with jspdf-autotable
- **Icons**: Lucide React

### Backend & Database
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with OAuth (Google, GitHub)
- **Storage**: Supabase Storage for property images
- **Server Actions**: Next.js server actions for data mutations
- **Middleware**: Next.js middleware for authentication

### Development Tools
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## Core Features

### 1. Multi-Property Management
- **Property Dashboard**: Overview of all properties with key metrics
- **Property CRUD**: Create, read, update, and delete properties
- **Property Images**: Upload and manage property thumbnail images
- **Portfolio View**: Visual grid layout showing all properties

### 2. Inventory Management
- **Stock Tracking**: Real-time inventory levels for consumable items
- **Low Stock Alerts**: Visual indicators when items fall below minimum thresholds
- **Stock Adjustments**: Dispatch items to guests or restock supplies
- **Permanent Utilities**: Track utilities like electricity, WiFi, water with variable costs
- **Inventory History**: Complete audit trail of all stock movements

### 3. Guest Management & Bookings
- **Booking System**: Record guest stays with payout information
- **Guest Tracking**: Monitor current and past guest information
- **Booking CRUD**: Create, edit, and delete booking records
- **Stay Status**: Visual indicators for active, upcoming, and past stays

### 4. Financial Tracking
- **Revenue Tracking**: Record and track booking payouts
- **Expense Management**: Track inventory costs and utility expenses
- **Profit Calculation**: Real-time profit/loss calculations per property
- **Financial Reports**: Filterable views by time period (monthly, quarterly, yearly)

### 5. User Authentication
- **Email/Password**: Traditional login system
- **OAuth Integration**: Google and GitHub social login
- **Session Management**: Secure session handling with middleware
- **User Profiles**: Basic user information and avatar support

## Database Schema

### Core Tables

#### `properties`
- `id` (UUID, Primary Key)
- `name` (string) - Property name
- `address` (string) - Property address
- `host_id` (UUID) - Foreign key to auth.users
- `thumbnail_url` (string) - Public URL to property image
- `created_at` (timestamp)

#### `inventory_items`
- `id` (UUID, Primary Key)
- `property_id` (UUID) - Foreign key to properties
- `name` (string) - Item name
- `quantity` (integer) - Current stock level
- `min_stock` (integer) - Minimum threshold
- `cost_per_unit` (decimal) - Unit cost for expense tracking
- `is_permanent` (boolean) - Whether this is a utility (electricity, WiFi, etc.)
- `created_at` (timestamp)

#### `bookings`
- `id` (UUID, Primary Key)
- `property_id` (UUID) - Foreign key to properties
- `guest_name` (string) - Guest's name
- `payout_amount` (decimal) - Revenue from booking
- `check_in` (date) - Check-in date
- `check_out` (date) - Check-out date
- `created_at` (timestamp)

#### `inventory_logs`
- `id` (UUID, Primary Key)
- `property_id` (UUID) - Foreign key to properties
- `item_id` (UUID) - Foreign key to inventory_items
- `item_name` (string) - Snapshot of item name at time of action
- `action_type` (enum: 'DISPATCH' | 'RESTOCK') - Type of stock movement
- `amount` (integer) - Quantity changed
- `price_at_time` (decimal) - Cost per unit at time of action (for variable utilities)
- `created_at` (timestamp)

## Key Components

### Dashboard (`src/app/dashboard/page.tsx`)
- Main portfolio overview
- Property grid with visual indicators
- Financial summaries
- Quick actions for adding properties

### Property Detail View (`src/app/dashboard/properties/[id]/PropertyDetailView.tsx`)
- Individual property management
- Inventory list with stock controls
- Booking history
- Financial performance metrics
- Time-based filtering (monthly, quarterly, yearly)

### Inventory Management Components
- **Stock Adjuster** (`src/components/dashboard/stock-adjuster.tsx`): Controls for dispatching/restocking items
- **Add Item Modal** (`src/components/dashboard/add-item-modal.tsx`): Form for adding new inventory items
- **Inventory History** (`src/components/dashboard/inventory-history.tsx`): Audit trail of stock movements

### Booking Management Components
- **Add Booking Modal** (`src/components/dashboard/add-booking-modal.tsx`): Form for recording new stays
- **Bookings List** (`src/components/dashboard/bookings-list.tsx`): Display and manage booking records
- **Edit Booking Modal** (`src/components/dashboard/edit-booking-modal.tsx`): Update booking details

### Property Management Components
- **New Property Form** (`src/components/dashboard/new-property-form.tsx`): Create new properties
- **Edit Property Form** (`src/components/dashboard/edit-property-form.tsx`): Update property details
- **Delete Property Button** (`src/components/dashboard/delete-property-button.tsx`): Remove properties

### Utility Components
- **User Navigation** (`src/components/dashboard/user-nav.tsx`): User profile and logout
- **Low Stock Modal** (`src/components/dashboard/low-stock-modal.tsx`): Shopping list for restocking
- **PDF Helper** (`src/lib/utils/pdf-helper.ts`): Generate shopping lists as PDFs

## Data Flow Architecture

### Authentication Flow
1. User logs in via email/password or OAuth
2. Supabase creates session and sets secure cookies
3. Middleware validates session on protected routes
4. Server components access user context via Supabase server client

### Property Management Flow
1. User creates property via form
2. Image uploaded to Supabase Storage
3. Property record created in database with image URL
4. Dashboard revalidates and displays new property

### Inventory Management Flow
1. User adds inventory item to property
2. Item record created with initial stock and cost
3. When items are dispatched/restocked:
   - Stock level updated in inventory_items
   - Log entry created in inventory_logs with price snapshot
   - Financial calculations updated

### Booking Management Flow
1. User records new booking with guest details and payout
2. Booking record created in database
3. Financial calculations include booking revenue
4. Dashboard shows updated financial metrics

## Key Business Logic

### Stock Level Calculations
- **Low Stock Detection**: `quantity <= min_stock` for non-permanent items
- **Stock Adjustments**: Real-time updates with audit trail
- **Permanent Utilities**: No stock tracking, variable cost per usage

### Financial Calculations
- **Revenue**: Sum of all booking payout amounts
- **Expenses**: Sum of `(log.amount * log.price_at_time)` for all dispatch logs
- **Profit**: Revenue - Expenses
- **Time Filtering**: Calculations filtered by selected time period

### Inventory Alerts
- **Visual Indicators**: Red badges and alerts on dashboard
- **Shopping List**: PDF generation for items below threshold
- **Auto-calculation**: Suggested order quantities based on minimum stock

## Security Features

### Authentication & Authorization
- **Session-based auth** with secure cookies
- **Middleware protection** for all dashboard routes
- **User isolation** - users only see their own properties
- **OAuth integration** with Google and GitHub

### Data Security
- **Row Level Security (RLS)** on all database tables
- **Secure file uploads** with user-specific storage buckets
- **Input validation** on all forms and server actions
- **Error handling** without exposing sensitive information

## Performance Optimizations

### Database
- **Indexed queries** on frequently searched fields
- **Efficient joins** with proper foreign key relationships
- **Pagination** not yet implemented (opportunity for improvement)

### Frontend
- **Memoization** for expensive calculations (useMemo)
- **Conditional rendering** to avoid unnecessary computations
- **Lazy loading** of images and non-critical components
- **Efficient state updates** with targeted re-renders

### Caching
- **Next.js revalidation** after data mutations
- **Browser caching** for static assets
- **Supabase query caching** for frequently accessed data

## API Endpoints

### Server Actions (Next.js App Router)
- `createProperty` - Create new property with image upload
- `updateProperty` - Update existing property
- `deleteProperty` - Delete property and associated data
- `addInventoryItem` - Add new inventory item
- `adjustStock` - Update stock levels and create logs
- `updateItem` - Update item details
- `deleteItem` - Remove inventory item
- `addBooking` - Record new booking
- `updateBooking` - Update booking details
- `deleteBooking` - Remove booking record

### API Routes
- `/auth/callback` - OAuth callback handler for Supabase

## File Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Main dashboard and property management
│   │   ├── actions.ts          # Server actions for dashboard operations
│   │   ├── page.tsx            # Dashboard overview
│   │   └── properties/         # Property-specific routes
│   │       ├── [id]/           # Dynamic property pages
│   │       └── new/            # New property creation
│   ├── (auth)/                 # Authentication routes
│   │   ├── actions.ts          # Auth server actions
│   │   └── auth/
│   │       ├── login/          # Login page
│   │       └── callback/       # OAuth callback
│   └── layout.tsx              # Root layout with styling
├── components/                  # Reusable UI components
│   ├── auth/                   # Authentication components
│   ├── dashboard/              # Dashboard-specific components
│   └── ui/                     # Generic UI components
├── lib/                        # Utility libraries
│   ├── supabase/              # Supabase client configuration
│   └── utils/                 # Helper functions
└── types/                     # TypeScript type definitions
```

## Configuration

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for server actions)

### Database Configuration
- **Row Level Security** enabled on all tables
- **Storage buckets** configured for property images
- **Database functions** for complex queries (if needed)

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Setup
1. Create Supabase project
2. Run database migrations
3. Configure storage buckets
4. Set up environment variables
5. Enable Row Level Security policies

## Future Enhancements

### Potential Improvements
1. **Pagination** for large datasets
2. **Advanced reporting** with charts and graphs
3. **Mobile responsiveness** improvements
4. **Bulk operations** for inventory management
5. **Integration** with property management platforms
6. **Automated reminders** for restocking
7. **Multi-currency** support
8. **Team collaboration** features

### Technical Debt
1. **Type definitions** - Currently using `any` types extensively
2. **Error handling** - Could be more robust
3. **Testing** - No test suite currently implemented
4. **Performance monitoring** - No observability tools

## Usage Patterns

### For Property Managers
1. **Daily Operations**: Check dashboard for low stock alerts
2. **Guest Management**: Record bookings and track stays
3. **Inventory Control**: Monitor stock levels and restock as needed
4. **Financial Tracking**: Review revenue, expenses, and profit margins

### For Hosts with Multiple Properties
1. **Portfolio Overview**: Monitor all properties from single dashboard
2. **Comparative Analysis**: Compare performance across properties
3. **Centralized Management**: Manage inventory and bookings from one place
4. **Time-based Reporting**: Analyze performance by month, quarter, or year

## Conclusion

HostFlow provides a comprehensive solution for short-term rental property managers who need to track inventory, manage guest bookings, and monitor financial performance. The application combines modern web technologies with practical business logic to create an intuitive and powerful management tool.

The codebase demonstrates good practices in Next.js development, TypeScript usage, and database design, while providing a solid foundation for future enhancements and scaling.