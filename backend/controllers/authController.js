// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new user
const register = async (req, res) => {
  console.log('Register attempt started');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    console.log('Validation failed:', errorMessages);
    res.send('Validation error: ' + errorMessages);
    return;
  }

  const { username, email, password } = req.body;
  console.log('Validation passed, body:', { username, email, password: '***' });

  try {
    // Check if user already exists
    console.log('Checking if user exists');
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.log('User already exists');
      res.send('User already exists');
      return;
    }

    console.log('Creating new user');
    // Create new user
    user = new User({ username, email, password, role: 'admin' });
    await user.save();
    console.log('User saved successfully');

    // Create token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    console.log('Signing JWT');
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err.message);
          res.send('Server error');
          return;
        }
        console.log('JWT signed successfully');
        // Set JWT token in HTTP-only cookie and redirect to login page after successful registration
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000 // 1 hour
        });
        console.log('Redirecting to login');
        res.redirect('/login');
      }
    );
  } catch (err) {
    console.error('Register catch error:', err.message);
    res.send('Server error');
  }
};

// Login user
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Set JWT token in HTTP-only cookie and redirect to dashboard
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000 // 1 hour
        });
        res.redirect('/dashboard');
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { register, login };