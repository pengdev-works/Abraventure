-- schema.sql
-- Neon PostgreSQL database schema for AbraVenture

CREATE TABLE IF NOT EXISTS tourist_spots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guides (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  accreditation_level VARCHAR(100), -- e.g., 'DOT Accredited', 'Local Expert'
  contact_number VARCHAR(50),
  bio TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homestays (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_per_night DECIMAL(10, 2),
  amenities TEXT[],
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings_inquiry (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- e.g., 'homestay', 'guide'
  target_id INTEGER NOT NULL, -- references homestay_id or guide_id depending on type
  guest_name VARCHAR(255) NOT NULL,
  contact_details VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: We are not enforcing explicit foreign keys on target_id across two tables (polymorphic), 
-- but it serves as a reference.
