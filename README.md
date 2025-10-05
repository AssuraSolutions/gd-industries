# GD INDUSTRIES E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js, TypeScript, and Prisma.

## Features

### Customer Features
- 🛍️ Browse products by categories and subcategories
- 🔍 Filter products by availability (In Stock/Out of Stock)
- 🛒 Shopping cart with quantity management
- 📱 WhatsApp checkout integration
- 📄 Download cart as PDF
- 📱 Fully responsive design
- 🎨 Modern fashion-style UI

### Admin Features
- 📊 Comprehensive dashboard with analytics
- 📦 Product management (CRUD operations)
- 📋 Order management with manual order creation
- 🏷️ Parent & child category management
- 💰 Offers and promotions management
- ⚙️ Store settings configuration
- 🔐 Secure admin authentication

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **PDF Generation:** jsPDF

## Database Setup

### Prerequisites
- PostgreSQL database (local or cloud-hosted)
- Node.js 18+ installed

### Setup Instructions

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Configure database connection:**
Create a `.env` file in the root directory:
\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/gd_industries"
\`\`\`

3. **Run Prisma migrations:**
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

4. **Generate Prisma Client:**
\`\`\`bash
npx prisma generate
\`\`\`

5. **Seed the database (optional):**
\`\`\`bash
npx prisma db seed
\`\`\`

## Environment Variables

Create a `.env` file with the following variables:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gd_industries"

# Admin Credentials (for initial setup)
ADMIN_EMAIL="admin@gdindustries.com"
ADMIN_PASSWORD="admin123"

# WhatsApp Business Number (without + sign)
WHATSAPP_NUMBER="923001234567"

# Store Configuration
NEXT_PUBLIC_STORE_NAME="GD INDUSTRIES"
NEXT_PUBLIC_STORE_EMAIL="info@gdindustries.com"
NEXT_PUBLIC_STORE_PHONE="+92 300 1234567"
\`\`\`

## Running the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` for the customer website and `http://localhost:3000/admin` for the admin panel.

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

## Admin Access

- **URL:** `/admin`
- **Default Credentials:**
  - Email: admin@gdindustries.com
  - Password: admin123

**Important:** Change the default admin password after first login!

## Prisma Commands

\`\`\`bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Format schema file
npx prisma format
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── (customer)/          # Customer-facing pages
│   ├── admin/               # Admin panel pages
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/
│   ├── admin/               # Admin components
│   ├── ui/                  # shadcn/ui components
│   └── ...                  # Shared components
├── lib/
│   ├── types.ts             # TypeScript types
│   ├── data.ts              # Mock data (for development)
│   ├── pdf-generator.ts     # PDF generation utilities
│   └── whatsapp.ts          # WhatsApp integration
├── hooks/
│   └── use-cart.ts          # Shopping cart hook
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
\`\`\`

## Features in Detail

### WhatsApp Checkout
Customers can send their cart directly to your WhatsApp business number with all product details pre-filled. Configure your WhatsApp number in the environment variables.

### PDF Generation
Customers can download their shopping cart as a professional PDF document including product images, details, and pricing.

### Category Management
Support for parent and child categories with unlimited nesting. Manage categories through the admin panel.

### Order Management
- View all orders with filtering and search
- Manually create orders through admin panel
- Update order status
- Track order history

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
Ensure your hosting platform supports:
- Node.js 18+
- PostgreSQL database
- Environment variables

## Support

For issues or questions, contact: info@gdindustries.com

## License

Proprietary - GD INDUSTRIES © 2025
