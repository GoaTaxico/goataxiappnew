# Goa Taxi App 🚗

A modern taxi booking platform built with Next.js, Supabase, and Razorpay for the beautiful state of Goa.

## 🚀 Features

### For Users
- **Easy Booking**: Select vehicle type, pickup/drop locations, date/time
- **Nearby Drivers**: Find and connect with nearby drivers instantly
- **Direct Communication**: Negotiate fares directly via WhatsApp/Call
- **No Booking Fees**: Direct payment between driver and passenger

### For Drivers
- **Simple Registration**: Google Auth + WhatsApp verification
- **Free Trial**: 30-day free trial, then monthly subscription
- **Profile Management**: Update vehicle details and contact info
- **Location Tracking**: Real-time location sharing

### For Admins
- **Driver Management**: Approve/reject driver applications
- **Subscription Control**: Manage driver subscriptions
- **Analytics Dashboard**: View bookings, revenue, and user stats

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Payment**: Razorpay
- **Maps**: Google Maps API
- **State Management**: Zustand
- **Forms**: React Hook Form

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goa-taxi-app
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Manual setup (if not using script)**
   ```bash
   npm install
   ```

### Environment Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

2. **Update `.env.local` with your API keys:**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # Google Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME="Goa Taxi App"
   ```

### Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run the database schema**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the script

3. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable Google OAuth
   - Add your Google OAuth credentials
   - Set redirect URL to `http://localhost:3000/auth/callback`

4. **Set up Storage**
   - Go to Storage
   - Create a new bucket called `avatars`
   - Set it to public
   - Create another bucket called `vehicles` (public)

### Google Maps API Setup

1. **Create a Google Cloud project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable APIs**
   - Enable Maps JavaScript API
   - Enable Places API
   - Enable Geocoding API

3. **Create API key**
   - Go to Credentials
   - Create API key
   - Restrict it to your domain

### Razorpay Setup

1. **Create Razorpay account**
   - Go to [razorpay.com](https://razorpay.com)
   - Sign up for a business account

2. **Get API keys**
   - Go to Settings > API Keys
   - Generate new key pair
   - Note down Key ID and Key Secret

### Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Test the application**
   - Try booking a ride
   - Test driver registration
   - Verify authentication flow

## 🗄 Database Schema

The app uses the following main tables:
- `profiles` - User and driver profiles
- `drivers` - Driver-specific information
- `vehicles` - Vehicle details
- `bookings` - Booking records
- `subscriptions` - Driver subscription data
- `payments` - Payment records

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Setup
1. Create a new Supabase project
2. Run the database schema
3. Configure authentication
4. Set up storage buckets for profile pictures

## 📱 Mobile App Experience

The web app is designed to feel like a native mobile app with:
- Bottom navigation bar
- Swipe gestures
- Full-screen booking flow
- Smooth animations and transitions

## 🔐 Security Features

- Supabase Row Level Security (RLS)
- Google OAuth authentication
- WhatsApp number verification
- Admin approval for drivers
- Secure payment processing

## 📞 Support

For support and questions, please contact:
- Email: support@goataxi.app
- WhatsApp: +91-XXXXXXXXXX

## 📄 License

This project is licensed under the MIT License.
