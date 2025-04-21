const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: 'Username and password are required.' });
  }

  if (password.length < 8) {
    return res.json({ success: false, message: 'Password must be at least 8 characters long.' });
  }

  try {
    // Check if username already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }

      if (results.length > 0) {
        return res.json({ success: false, message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.query(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error creating user' });
          }
          res.json({ success: true, message: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
