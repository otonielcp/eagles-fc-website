# Eagles FC Website - Setup Guide

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (v10 or higher) - Already installed globally
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation Steps

### 1. Dependencies Installation ✅

All dependencies have been installed successfully using:
```bash
pnpm install
```

### 2. Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/eagles-fc
# Or use MongoDB Atlas connection string:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eagles-fc?retryWrites=true&w=majority

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Service Setup

#### MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```
3. Use connection string: `mongodb://localhost:27017/eagles-fc`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string and replace in `.env.local`
4. Whitelist your IP address in Atlas dashboard

#### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Go to Developers → API keys
3. Copy your **Publishable key** and **Secret key**
4. For testing, use the test mode keys (starting with `pk_test_` and `sk_test_`)
5. Add them to your `.env.local` file

#### Cloudinary Setup

1. Create a free account at https://cloudinary.com
2. Go to Dashboard
3. Copy your:
   - Cloud name
   - API Key
   - API Secret
4. Add them to your `.env.local` file

## Running the Application

### Development Mode

```bash
pnpm dev
```

The application will be available at http://localhost:3000

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Linting

```bash
pnpm lint
```

## Project Structure

- `/app` - Next.js 15 App Router pages and layouts
  - `/(landing)` - Public-facing pages
  - `/admin` - Admin dashboard pages
  - `/api` - API routes
- `/components` - React components
  - `/admin` - Admin-specific components
  - `/landing` - Landing page components
  - `/ui` - Reusable UI components (shadcn/ui)
- `/actions` - Server actions for data mutations
- `/lib` - Utility functions and configurations
- `/models` - MongoDB/Mongoose models
- `/types` - TypeScript type definitions
- `/public` - Static assets

## Key Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **MongoDB** with Mongoose for database
- **Stripe** for payment processing
- **Cloudinary** for image/video management
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **Zustand** for state management

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:
```bash
pnpm dev -- -p 3001
```

### MongoDB Connection Issues

#### Error: "Connection failed. If the problem persists, please check your internet connection or VPN"

This error indicates that the application cannot connect to MongoDB. Follow these troubleshooting steps:

**1. Check Environment Variables**
- Verify that `.env.local` file exists in the root directory
- Ensure `MONGO_URI` is set correctly:
  ```bash
  # For local MongoDB
  MONGO_URI=mongodb://localhost:27017/eagles-fc
  
  # For MongoDB Atlas
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eagles-fc?retryWrites=true&w=majority
  ```

**2. For Local MongoDB:**
- Check if MongoDB service is running:
  ```bash
  # Windows
  net start MongoDB
  
  # Check service status
  sc query MongoDB
  ```
- If not running, start the service or install MongoDB
- Verify MongoDB is listening on port 27017:
  ```bash
  # Windows
  netstat -an | findstr 27017
  ```

**3. For MongoDB Atlas (Cloud):**
- **IP Whitelist**: Go to Atlas Dashboard → Network Access → Add your current IP address (or use `0.0.0.0/0` for all IPs in development)
- **Connection String**: Verify username and password are correct in the connection string
- **VPN/Network**: If using VPN, ensure it's not blocking MongoDB Atlas connections
  - Try disconnecting VPN temporarily to test
  - Some corporate VPNs block MongoDB connections
- **Firewall**: Check if your firewall is blocking outbound connections to MongoDB (port 27017 or SRV)
- **Connection String Format**: Ensure the connection string uses the correct format:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
  ```

**4. General Network Issues:**
- Test your internet connection
- Check if you're behind a proxy that might block database connections
- Try connecting from a different network to isolate the issue
- For corporate networks, contact IT about MongoDB/Atlas access

**5. Quick Test:**
Create a test script to verify the connection:
```bash
# Test MongoDB connection (requires mongosh or mongo client)
mongosh "your-connection-string-here"
```

### Missing Dependencies

If you encounter missing dependencies:
```bash
pnpm install
```

### Build Errors

Clear Next.js cache and rebuild:
```bash
rm -rf .next
pnpm build
```

## Additional Notes

- The application uses **pnpm** as the package manager
- All images should be uploaded through Cloudinary
- Payment processing is handled through Stripe
- Admin authentication is required for admin routes

## Support

For issues or questions, please refer to the project documentation or contact the development team.




