-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'driver', 'admin');
CREATE TYPE vehicle_type AS ENUM ('hatchback', 'sedan', 'suv');
CREATE TYPE driver_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'expired', 'cancelled');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    whatsapp TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    license_number TEXT UNIQUE,
    vehicle_type vehicle_type NOT NULL,
    car_name TEXT NOT NULL,
    car_number TEXT NOT NULL,
    car_color TEXT,
    car_model_year INTEGER,
    status driver_status DEFAULT 'pending',
    is_online BOOLEAN DEFAULT FALSE,
    current_location GEOGRAPHY(POINT),
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_rides INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.0,
    subscription_status subscription_status DEFAULT 'trial',
    trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table (for detailed vehicle information)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    type vehicle_type NOT NULL,
    name TEXT NOT NULL,
    number TEXT NOT NULL,
    color TEXT,
    model_year INTEGER,
    capacity INTEGER DEFAULT 4,
    ac_available BOOLEAN DEFAULT TRUE,
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_type vehicle_type NOT NULL,
    pickup_location TEXT NOT NULL,
    pickup_coordinates GEOGRAPHY(POINT),
    drop_location TEXT NOT NULL,
    drop_coordinates GEOGRAPHY(POINT),
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    passenger_count INTEGER DEFAULT 1,
    estimated_fare DECIMAL(10,2),
    final_fare DECIMAL(10,2),
    status booking_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    razorpay_subscription_id TEXT UNIQUE,
    razorpay_customer_id TEXT,
    plan_name TEXT DEFAULT 'Monthly Driver Subscription',
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status subscription_status DEFAULT 'trial',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_order_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status DEFAULT 'pending',
    payment_method TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver locations table (for real-time tracking)
CREATE TABLE driver_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
    location GEOGRAPHY(POINT) NOT NULL,
    heading DECIMAL(5,2),
    speed DECIMAL(5,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_location ON drivers USING GIST(current_location);
CREATE INDEX idx_drivers_online ON drivers(is_online) WHERE is_online = TRUE;
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(pickup_date);
CREATE INDEX idx_subscriptions_driver_id ON subscriptions(driver_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_driver_locations_driver_id ON driver_locations(driver_id);
CREATE INDEX idx_driver_locations_timestamp ON driver_locations(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get nearby drivers
CREATE OR REPLACE FUNCTION get_nearby_drivers(
    user_location GEOGRAPHY(POINT),
    vehicle_type_filter vehicle_type DEFAULT NULL,
    radius_meters INTEGER DEFAULT 5000
)
RETURNS TABLE (
    driver_id UUID,
    user_id UUID,
    full_name TEXT,
    phone TEXT,
    whatsapp TEXT,
    avatar_url TEXT,
    vehicle_type vehicle_type,
    car_name TEXT,
    car_number TEXT,
    rating DECIMAL(3,2),
    total_rides INTEGER,
    distance_meters DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id as driver_id,
        p.id as user_id,
        p.full_name,
        p.phone,
        p.whatsapp,
        p.avatar_url,
        d.vehicle_type,
        d.car_name,
        d.car_number,
        d.rating,
        d.total_rides,
        ST_Distance(d.current_location, user_location) as distance_meters
    FROM drivers d
    JOIN profiles p ON d.user_id = p.id
    WHERE d.status = 'approved'
        AND d.is_online = TRUE
        AND d.subscription_status IN ('trial', 'active')
        AND d.current_location IS NOT NULL
        AND ST_DWithin(d.current_location, user_location, radius_meters)
        AND (vehicle_type_filter IS NULL OR d.vehicle_type = vehicle_type_filter)
    ORDER BY ST_Distance(d.current_location, user_location)
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Drivers policies
CREATE POLICY "Drivers can view their own driver profile" ON drivers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Drivers can update their own driver profile" ON drivers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Drivers can insert their own driver profile" ON drivers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view approved drivers" ON drivers
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Admins can view all drivers" ON drivers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Vehicles policies
CREATE POLICY "Drivers can manage their vehicles" ON vehicles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM drivers 
            WHERE id = driver_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view vehicle details" ON vehicles
    FOR SELECT USING (TRUE);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Drivers can view bookings assigned to them" ON bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM drivers 
            WHERE id = driver_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Drivers can update bookings assigned to them" ON bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM drivers 
            WHERE id = driver_id AND user_id = auth.uid()
        )
    );

-- Subscriptions policies
CREATE POLICY "Drivers can view their own subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM drivers 
            WHERE id = driver_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Payments policies
CREATE POLICY "Drivers can view their own payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subscriptions s
            JOIN drivers d ON s.driver_id = d.id
            WHERE s.id = subscription_id AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all payments" ON payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Driver locations policies
CREATE POLICY "Drivers can update their own location" ON driver_locations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM drivers 
            WHERE id = driver_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view driver locations" ON driver_locations
    FOR SELECT USING (TRUE);

-- Insert default admin user (you should change this password)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
) VALUES (
    uuid_generate_v4(),
    'admin@goataxi.app',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name": "Admin User", "role": "admin"}'
);

-- Update the admin profile role
UPDATE profiles SET role = 'admin' WHERE email = 'admin@goataxi.app';
