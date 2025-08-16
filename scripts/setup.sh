#!/bin/bash

# Goa Taxi App Setup Script
echo "🚗 Setting up Goa Taxi App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
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
EOF
    echo "✅ Created .env.local file. Please update it with your actual API keys."
else
    echo "✅ .env.local file already exists."
fi

# Create public directory if it doesn't exist
mkdir -p public

# Create placeholder images directory
mkdir -p public/images

echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your actual API keys"
echo "2. Set up your Supabase project and run the schema.sql"
echo "3. Configure Google Maps API and Razorpay"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed setup instructions, see README.md"
