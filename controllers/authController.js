
const express = require('express');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();


/*------------------ Models ------------------*/

const User = require('../models/User');
const Post = require('../models/Post');

/*------------------ Routes ------------------*/

router.get('/login', (req, res) => {
    res.render('auth/login', { user: req.session.currentUser });
});

router.get('/register', (req, res) => {
    res.render('auth/register', { user: req.session.currentUser });
});


router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone
        });

        await newUser.save();
        res.redirect('login');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/auth/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash('error', 'Invalid credentials');
            return res.redirect('/auth/login');
        }

        req.session.userId = user._id;
        res.redirect('/auth/profile');
    } catch (err) {
        req.flash('error', 'An unexpected error occurred');
        res.redirect('/auth/login');
    }
});



router.get('/logout', (req, res) => {
    // Handle logout logic
    req.session.destroy();
    res.redirect('/auth/login');
});


router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(400).send('User not found');
        }
        const posts = await Post.find({ author: user._id });
        res.render('pages/profile', { user, posts });
      } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send('An error occurred.');
      }
    });


router.put('/edit', isAuthenticated, async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        const user = await User.findByIdAndUpdate(req.session.userId, { username, email, phone }, { new: true });
        if (!user) {
            return res.status(400).send('Error updating profile');
        }
        res.redirect('profile');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});


router.delete('/delete', isAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.userId);
        res.redirect('login');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});




module.exports = router;
