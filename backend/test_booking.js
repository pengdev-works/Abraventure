const axios = require('axios');

async function testBooking() {
  try {
    const res = await axios.post('http://localhost:5000/api/inquiry', {
      type: 'homestay',
      target_id: 1,
      guest_name: 'Test Guest',
      contact_details: '09123456789',
      booking_date: '2026-05-01',
      message: 'Testing the system',
      payment_reference: '1234567890123'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('API Error:', err.response ? err.response.data : err.message);
  }
}

testBooking();
