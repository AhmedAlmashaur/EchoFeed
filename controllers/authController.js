
const express = require('express');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middleware/isAuthenticated');

const router = express.Router();


/*------------------ Models ------------------*/

const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

/*------------------ Routes ------------------*/

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
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
        res.send('Registration successful');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        req.session.userId = user._id;
        res.send('Login successful');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});


router.get('/logout', (req, res) => {
    // Handle logout logic
    req.session.destroy();
    res.redirect('/');
});

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(400).send('User not found');
        }
        res.render('pages/profile', { user });
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});


router.put('/edit', isAuthenticated, async (req, res) => {
    try {
        const { username, email, phone } = req.body;
        const user = await User.findByIdAndUpdate(req.session.userId, { username, email, phone }, { new: true });
        if (!user) {
            return res.status(400).send('Error updating profile');
        }
        res.send('Profile updated');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});


router.delete('/delete', isAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.userId);
        res.send('Account deleted');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});




module.exports = router;
