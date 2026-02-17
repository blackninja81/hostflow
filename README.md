# HostFlow

HostFlow is a comprehensive property management and inventory tracking system built with Next.js, Supabase, and TypeScript. This application provides a complete solution for managing properties, tracking inventory, and handling bookings with a modern, responsive interface.

## Features

### Property Management
- **Multi-Property Support**: Manage multiple properties from a single dashboard
- **Property Details**: View and edit comprehensive property information including amenities, rules, and contact details
- **Property Creation**: Easy setup for new properties with guided forms
- **Property Deletion**: Secure deletion with confirmation prompts

### Inventory Management
- **Real-time Stock Tracking**: Monitor inventory levels across all properties
- **Low Stock Alerts**: Automatic notifications when items reach critical levels
- **Stock Adjustments**: Manual stock adjustments with reason tracking
- **Restocking**: Quick restock functionality with quantity management
- **Inventory History**: Complete audit trail of all inventory changes

### Booking Management
- **Booking Calendar**: Visual calendar view of all bookings
- **Booking Details**: Comprehensive booking information including guest details
- **Booking Creation**: Easy booking setup with property and date selection
- **Booking Editing**: Modify existing bookings with full edit capabilities

### User Interface
- **Modern Design**: Clean, intuitive interface built with shadcn/ui components
- **Responsive Layout**: Works seamlessly across desktop, tablet, and mobile devices
- **Dark/Light Mode**: System preference-based theme switching
- **Real-time Updates**: Live data updates without page refreshes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with Google OAuth
- **State Management**: TanStack Query for data fetching and caching
- **Forms**: React Hook Form with Zod validation
- **PDF Generation**: jsPDF for document creation
- **Icons**: Lucide React icons

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Supabase account for database and authentication

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/hostflow.git
   cd hostflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Supabase configuration:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── dashboard/          # Main dashboard and property management
│   ├── inventory/          # Inventory management pages
│   ├── properties/         # Property listing pages
│   └── (auth)/            # Authentication routes
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── auth/             # Authentication components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and configurations
│   ├── supabase/         # Supabase client and server utilities
│   └── utils/            # General utility functions
├── services/             # API services and data fetching
└── types/               # TypeScript type definitions
```

## Key Features Implementation

### Property Management
Properties are managed through Supabase database with real-time updates. The dashboard provides a comprehensive view of all properties with quick access to details and management actions.

### Inventory Tracking
The inventory system tracks stock levels across all properties with automatic low-stock notifications. Users can adjust stock levels, restock items, and view complete history of changes.

### Booking System
Bookings are integrated with property management, allowing users to view booking calendars, create new bookings, and manage existing ones with full edit capabilities.

## Database Schema

The application uses Supabase PostgreSQL with the following key tables:
- `properties` - Property information and settings
- `inventory_items` - Inventory items and stock levels
- `bookings` - Booking and reservation data
- `users` - User authentication and profile data

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `docs/` directory
- Join our community discussions

## Development

### Running Tests
```bash
npm test
# or
yarn test
```

### Building for Production
```bash
npm run build
# or
yarn build
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Screenshots

[Include screenshots of the application interface here]

## Roadmap

- [ ] Mobile app development
- [ ] Advanced reporting and analytics
- [ ] Integration with external booking platforms
- [ ] Multi-language support
- [ ] Advanced inventory forecasting

## Acknowledgments

- Built with Next.js and Supabase
- UI components from shadcn/ui
- Icons from Lucide React
- PDF generation with jsPDF
