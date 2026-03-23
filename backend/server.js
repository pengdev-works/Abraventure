require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const verifyToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins for easier deployment & presentation

app.use(express.json({ limit: '10mb' }));

// Routes
app.get('/api/spots', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tourist_spots ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching spots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/spots/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tourist_spots WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Spot not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching spot details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/guides', async (req, res) => {
  try {
    const { accreditation } = req.query;
    let query = 'SELECT * FROM guides';
    const params = [];

    if (accreditation) {
      query += ' WHERE accreditation_level = $1';
      params.push(accreditation);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/homestays', async (req, res) => {
  try {
    const { max_price } = req.query;
    let query = 'SELECT * FROM homestays';
    const params = [];

    if (max_price) {
      query += ' WHERE price_per_night <= $1';
      params.push(max_price);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching homestays:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/inquiry', async (req, res) => {
  try {
    const { type, target_id, guest_name, contact_details, booking_date, message, payment_reference } = req.body;
    
    // Basic validation
    if (!type || !target_id || !guest_name || !contact_details || !booking_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO bookings_inquiry 
      (type, target_id, guest_name, contact_details, booking_date, message, payment_reference)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const params = [type, target_id, guest_name, contact_details, booking_date, message, payment_reference];
    
    const result = await db.query(query, params);
    
    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry: result.rows[0] });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// ADMIN AUTHENTICATION ROUTES
// ==========================================

// Initial setup route (You should remove or secure this after the first admin is created)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if admin already exists
    const checkUser = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'Admin user created successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET || 'fallback_secret_for_local_dev', 
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// PROTECTED ADMIN CRUD ROUTES
// ==========================================

// Add a new Tourist Spot
app.post('/api/spots', verifyToken, async (req, res) => {
  try {
    const { name, description, location, image_url, directions, latitude, longitude } = req.body;
    const result = await db.query(
      'INSERT INTO tourist_spots (name, description, location, image_url, directions, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, location, image_url, directions, latitude, longitude]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a Tourist Spot
app.put('/api/spots/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, location, image_url, directions, latitude, longitude } = req.body;
    const result = await db.query(
      'UPDATE tourist_spots SET name = $1, description = $2, location = $3, image_url = $4, directions = $5, latitude = $6, longitude = $7 WHERE id = $8 RETURNING *',
      [name, description, location, image_url, directions, latitude, longitude, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Spot not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a Tourist Spot
app.delete('/api/spots/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM tourist_spots WHERE id = $1', [req.params.id]);
    res.json({ message: 'Spot deleted successfully' });
  } catch (error) {
    console.error('Error deleting spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new Guide
app.post('/api/guides', verifyToken, async (req, res) => {
  try {
    const { name, accreditation_level, contact_number, bio, image_url, location } = req.body;
    const result = await db.query(
      'INSERT INTO guides (name, accreditation_level, contact_number, bio, image_url, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, accreditation_level, contact_number, bio, image_url, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a Guide
app.put('/api/guides/:id', verifyToken, async (req, res) => {
  try {
    const { name, accreditation_level, contact_number, bio, image_url, location } = req.body;
    const result = await db.query(
      'UPDATE guides SET name = $1, accreditation_level = $2, contact_number = $3, bio = $4, image_url = $5, location = $6 WHERE id = $7 RETURNING *',
      [name, accreditation_level, contact_number, bio, image_url, location, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Guide not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a Guide
app.delete('/api/guides/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM guides WHERE id = $1', [req.params.id]);
    res.json({ message: 'Guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new Homestay
app.post('/api/homestays', verifyToken, async (req, res) => {
  try {
    const { name, description, price_per_night, amenities, image_url, location } = req.body;
    // Formatting amenities assuming it comes in as a comma-separated string from a simple form
    const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',').map(item => item.trim());
    
    const result = await db.query(
      'INSERT INTO homestays (name, description, price_per_night, amenities, image_url, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price_per_night, amenitiesArray, image_url, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding homestay:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a Homestay
app.put('/api/homestays/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, price_per_night, amenities, image_url, location } = req.body;
    const amenitiesArray = Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map(item => item.trim()) : []);
    const result = await db.query(
      'UPDATE homestays SET name = $1, description = $2, price_per_night = $3, amenities = $4, image_url = $5, location = $6 WHERE id = $7 RETURNING *',
      [name, description, price_per_night, amenitiesArray, image_url, location, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Homestay not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating homestay:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a Homestay
app.delete('/api/homestays/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM homestays WHERE id = $1', [req.params.id]);
    res.json({ message: 'Homestay deleted successfully' });
  } catch (error) {
    console.error('Error deleting homestay:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// INQUIRIES MANAGEMENT
// ==========================================

// Get all inquiries (Admin only)
app.get('/api/inquiries', verifyToken, async (req, res) => {
  try {
    // Joins with spots/guides/homestays to get the names would be ideal,
    // but a simple query works if we fetch basic info first. Let's do a LEFT JOIN to get names cleanly.
    const query = `
      SELECT 
        i.*,
        CASE 
          WHEN i.type = 'homestay' THEN h.name
          WHEN i.type = 'guide' THEN g.name
          ELSE 'Unknown'
        END as target_name
      FROM bookings_inquiry i
      LEFT JOIN homestays h ON i.type = 'homestay' AND i.target_id = h.id
      LEFT JOIN guides g ON i.type = 'guide' AND i.target_id = g.id
      ORDER BY i.created_at DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update inquiry status
app.put('/api/inquiries/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const result = await db.query(
      'UPDATE bookings_inquiry SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
