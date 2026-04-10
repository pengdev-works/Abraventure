-- schema.sql
-- Neon PostgreSQL database schema for AbraVenture

CREATE TABLE IF NOT EXISTS public.tourist_spots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  image_url TEXT,
  directions TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'tourist', -- 'admin', 'guide', 'homestay_owner', 'tourist'
  status VARCHAR(20) NOT NULL DEFAULT 'approved', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.guides (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  accreditation_level VARCHAR(100),
  contact_number VARCHAR(50),
  location VARCHAR(255),
  bio TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.homestays (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_night NUMERIC(10, 2),
  amenities TEXT[],
  location VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.bookings_inquiry (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  target_id INTEGER NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  contact_details VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  amount NUMERIC(10, 2) DEFAULT 0.00,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_reference VARCHAR(100)
);

-- NEW CAPSTONE TABLES

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.verified_reviews (
  id SERIAL PRIMARY KEY,
  inquiry_id INTEGER UNIQUE REFERENCES public.bookings_inquiry(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.municipal_metrics (
  id SERIAL PRIMARY KEY,
  municipality VARCHAR(100) UNIQUE NOT NULL,
  target_revenue NUMERIC(12, 2) DEFAULT 50000.00,
  total_visitors INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


