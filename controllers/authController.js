const express = require('express');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();

/*------------------ Models ------------------*/
const User = require('../models/User');
const Post = require('../models/Post');

/*------------------ Routes ------------------*/

// GET /auth/login
router.get('/login', (req, res) => {
    res.render('auth/login', { user: req.session.currentUser });
});

// GET /auth/register
router.get('/register', (req, res) => {
    res.render('auth/register', { user: req.session.currentUser });
});

// POST /auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Validate input
        if (!username || !email || !password || !phone) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/auth/register');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
        });

        await newUser.save();
        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/auth/login');
    } catch (err) {
        req.flash('error', `Error registering user: ${err.message}`);
        res.redirect('/auth/register');
    }
});

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            req.flash('error', 'Email and password are required.');
            return res.redirect('/auth/login');
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/auth/login');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid credentials.');
            return res.redirect('/auth/login');
        }

        // Set session and redirect
        req.session.userId = user._id;
        req.flash('success', 'Login successful.');
        res.redirect('/auth/profile');
    } catch (err) {
        req.flash('error', `Error logging in: ${err.message}`);
        res.redirect('/auth/login');
    }
});

// GET /auth/profile
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
      const user = await User.findById(req.session.userId);
      if (!user) {
        req.flash('error', 'User not found.');
        return res.redirect('/auth/login');
      }
  
      const posts = await Post.find({ author: user._id });
      res.render('pages/profile', { user, posts });
    } catch (err) {
      req.flash('error', `Error fetching profile: ${err.message}`);
      res.redirect('/auth/login');
    }
  });
  

// PUT /auth/edit
router.post('/edit', isAuthenticated, async (req, res) => {
    try {
      const { username, email, phone } = req.body;
  
      if (!username || !email || !phone) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/auth/profile');
      }
  
      const user = await User.findByIdAndUpdate(
        req.session.userId,
        { username, email, phone },
        { new: true } // Return the updated document
      );
  
      if (!user) {
        req.flash('error', 'Error updating profile.');
        return res.redirect('/auth/profile');
      }
  
      req.flash('success', 'Profile updated successfully.');
      res.redirect('/auth/profile');
    } catch (err) {
      req.flash('error', `Error updating profile: ${err.message}`);
      res.redirect('/auth/profile');
    }
  });
  

// DELETE /auth/delete
router.get('/logout', (req, res) => {
  // Set flash message before destroying the session
  req.flash('success', 'You have successfully logged out.');

  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/auth/profile');
    }
    res.redirect('/auth/login'); // Redirect after logout
  });
});


module.exports = router;
