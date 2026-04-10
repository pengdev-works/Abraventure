require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { verifyToken, checkRole } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins for easier deployment & presentation

app.use(express.json({ limit: '10mb' }));

// ==========================================
// CAPSTONE UTILITIES: AUDIT LOGGING
// ==========================================
const logAction = async (userId, action, entityType, entityId, details) => {
  try {
    await db.query(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [userId, action, entityType, entityId, details]
    );
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
};


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
// UNIFIED AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { password, email, role } = req.body;
    const username = req.body.username?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanUsername = username?.toLowerCase();
    
    if (!['admin', 'guide', 'homestay_owner'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists
    const checkUser = await db.query('SELECT * FROM users WHERE LOWER(username) = $1 OR LOWER(email) = $2', [cleanUsername, cleanEmail]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default status: Admins are approved, Guides/Owners are pending
    const status = role === 'admin' ? 'approved' : 'pending';

    const result = await db.query(
      'INSERT INTO users (username, password_hash, email, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role, status',
      [username, hashedPassword, cleanEmail, role, status]
    );

    const newUser = result.rows[0];

    // If guide or homestay_owner, create an empty entry in their respective tables
    if (role === 'guide') {
      await db.query('INSERT INTO guides (user_id, name) VALUES ($1, $2)', [newUser.id, username]);
    } else if (role === 'homestay_owner') {
      await db.query('INSERT INTO homestays (user_id, name) VALUES ($1, $2)', [newUser.id, username]);
    }

    res.status(201).json({ message: 'User registered successfully. Status: ' + status, user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    const username = req.body.username?.trim().toLowerCase();
    
    console.log(`[Login Attempt] Username: "${username}"`);

    const result = await db.query('SELECT * FROM users WHERE LOWER(TRIM(username)) = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      console.log(`[Login Failed] User "${username}" not found in database.`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`[Login Info] User found: ${user.username} | Role: ${user.role} | Status: ${user.status}`);

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log(`[Login Failed] Invalid password for user "${username}".`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`[Login Success] Token generated for "${username}".`);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, status: user.status }, 
      process.env.JWT_SECRET || 'fallback_secret_for_local_dev', 
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username, role: user.role, status: user.status });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LEGACY ADMIN ROUTES (Will migrate UI to use unified routes above)
app.post('/api/auth/register-legacy', async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkUser = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (checkUser.rows.length > 0) return res.status(400).json({ error: 'Username already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await db.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username', [username, hashedPassword]);
    res.status(201).json({ message: 'Legacy Admin created', user: result.rows[0] });
  } catch (error) { res.status(500).json({ error: 'Internal server error' }); }
});

// ==========================================
// PROTECTED ADMIN CRUD ROUTES
// ==========================================

// Add a new Tourist Spot
app.post('/api/spots', verifyToken, checkRole(['admin']), async (req, res) => {
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
app.put('/api/spots/:id', verifyToken, checkRole(['admin']), async (req, res) => {
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
app.delete('/api/spots/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM tourist_spots WHERE id = $1', [req.params.id]);
    await logAction(req.user.id, 'DELETE', 'tourist_spot', req.params.id, `Deleted spot id ${req.params.id}`);
    res.json({ message: 'Spot deleted successfully' });

  } catch (error) {
    console.error('Error deleting spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new Guide
app.post('/api/guides', verifyToken, checkRole(['admin']), async (req, res) => {
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
app.put('/api/guides/:id', verifyToken, checkRole(['admin', 'guide']), async (req, res) => {
  try {
    const { name, accreditation_level, contact_number, bio, image_url, location } = req.body;
    
    // Check ownership if role is guide
    if (req.user.role === 'guide') {
      const check = await db.query('SELECT user_id FROM guides WHERE id = $1', [req.params.id]);
      if (check.rows[0]?.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized to update this profile' });
      }
    }

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
app.delete('/api/guides/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM guides WHERE id = $1', [req.params.id]);
    res.json({ message: 'Guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new Homestay
app.post('/api/homestays', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { name, description, price_per_night, amenities, image_url, location } = req.body;
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
app.put('/api/homestays/:id', verifyToken, checkRole(['admin', 'homestay_owner']), async (req, res) => {
  try {
    const { name, description, price_per_night, amenities, image_url, location } = req.body;

    // Check ownership if role is homestay_owner
    if (req.user.role === 'homestay_owner') {
      const check = await db.query('SELECT user_id FROM homestays WHERE id = $1', [req.params.id]);
      if (check.rows[0]?.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized to update this listing' });
      }
    }

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
app.delete('/api/homestays/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    await db.query('DELETE FROM homestays WHERE id = $1', [req.params.id]);
    res.json({ message: 'Homestay deleted successfully' });
  } catch (error) {
    console.error('Error deleting homestay:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// PROFILE & OWNERSHIP MANAGEMENT
// ==========================================

// Get my profile/listing
app.get('/api/profile/me', verifyToken, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'guide') {
      result = await db.query('SELECT * FROM guides WHERE user_id = $1', [req.user.id]);
    } else if (req.user.role === 'homestay_owner') {
      result = await db.query('SELECT * FROM homestays WHERE user_id = $1', [req.user.id]);
    } else {
      return res.status(400).json({ error: 'Only Guides and Owners have profiles here' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get my inquiries
app.get('/api/my-inquiries', verifyToken, checkRole(['guide', 'homestay_owner']), async (req, res) => {
  try {
    let profileTable = req.user.role === 'guide' ? 'guides' : 'homestays';
    let typeFilter = req.user.role === 'guide' ? 'guide' : 'homestay';

    const query = `
      SELECT i.* 
      FROM bookings_inquiry i
      JOIN ${profileTable} p ON i.target_id = p.id
      WHERE i.type = $1 AND p.user_id = $2
      ORDER BY i.created_at DESC
    `;
    const result = await db.query(query, [typeFilter, req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching my inquiries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// USER MANAGEMENT (Admin Only)
// ==========================================

app.get('/api/admin/users', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/users/:id/status', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const result = await db.query(
      'UPDATE users SET status = $1 WHERE id = $2 RETURNING id, username, status',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// INQUIRIES MANAGEMENT (Global)
// ==========================================

// Get all inquiries (Admin only)
app.get('/api/inquiries', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
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

// Update inquiry status (Owner or Admin)
app.put('/api/inquiries/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, amount } = req.body;
    if (!['pending', 'confirmed', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Authorization: Admin or the Owner of the target
    if (req.user.role !== 'admin') {
      const inquiryResult = await db.query('SELECT type, target_id FROM bookings_inquiry WHERE id = $1', [req.params.id]);
      if (inquiryResult.rows.length === 0) return res.status(404).json({ error: 'Inquiry not found' });
      
      const inquiry = inquiryResult.rows[0];
      const profileTable = inquiry.type === 'guide' ? 'guides' : 'homestays';
      const checkResult = await db.query(`SELECT user_id FROM ${profileTable} WHERE id = $1`, [inquiry.target_id]);
      
      if (checkResult.rows[0]?.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized to update this inquiry' });
      }
    }

    const completedAt = status === 'completed' ? new Date() : null;
    
    const result = await db.query(
      'UPDATE bookings_inquiry SET status = $1, amount = COALESCE($2, amount), completed_at = COALESCE($3, completed_at) WHERE id = $4 RETURNING *',
      [status, amount, completedAt, req.params.id]
    );
    
    await logAction(req.user.id, 'UPDATE_STATUS', 'inquiry', req.params.id, `Changed status to ${status}`);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==========================================
// CAPSTONE ANALYTICS & GOVERNANCE
// ==========================================

// GET Municipal Impact Analytics
app.get('/api/admin/analytics/municipal', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const query = `
      SELECT 
        COALESCE(h.location, g.location) as municipality,
        COUNT(i.id) as total_inquiries,
        SUM(CASE WHEN i.status = 'completed' THEN i.amount ELSE 0 END) as total_revenue,
        COUNT(CASE WHEN i.status = 'completed' THEN 1 END) as completed_sessions
      FROM bookings_inquiry i
      LEFT JOIN homestays h ON i.type = 'homestay' AND i.target_id = h.id
      LEFT JOIN guides g ON i.type = 'guide' AND i.target_id = g.id
      WHERE h.location IS NOT NULL OR g.location IS NOT NULL
      GROUP BY municipality
      ORDER BY total_revenue DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET Audit Logs
app.get('/api/admin/audit-logs', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, u.username 
      FROM audit_logs a 
      JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC 
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SUBMIT Verified Review
app.post('/api/reviews', async (req, res) => {
  try {
    const { inquiry_id, rating, comment } = req.body;
    
    // Verify inquiry is completed
    const inquiry = await db.query('SELECT status FROM bookings_inquiry WHERE id = $1', [inquiry_id]);
    if (inquiry.rows.length === 0 || inquiry.rows[0].status !== 'completed') {
      return res.status(400).json({ error: 'Only completed experiences can be reviewed' });
    }

    const result = await db.query(
      'INSERT INTO verified_reviews (inquiry_id, rating, comment) VALUES ($1, $2, $3) RETURNING *',
      [inquiry_id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'Feedback already submitted for this experience' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/verified-impact', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        (SELECT SUM(amount) FROM bookings_inquiry WHERE status = 'completed') as total_impact,
        (SELECT COUNT(*) FROM users WHERE status = 'approved' AND role IN ('guide', 'homestay_owner')) as partner_count,
        (SELECT COUNT(*) FROM tourist_spots) as spot_count
    `);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
