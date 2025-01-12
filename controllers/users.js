// Initialize express router
const express = require('express');
const router = express.Router();

/*------------- Get routes ---------------*/

// Profile page
router.get('/profile', (req, res) => {
    res.render('users/profile.ejs', {
        user: req.session.user
    });
});

// Edit user profile
router.get('/profile/edit', (req, res) => {
    res.render('users/edit.ejs', {
        user: req.session.user
    });
});

/*------------- Put routes ---------------*/

// Update user profile
router.put('/profile', async (req, res) => {
    await User.findByIdAndUpdate(req.session.user._id, req.body);
    res.redirect('/profile');
});

/*------------- Delete routes ---------------*/

// Delete user profile
router.delete('/profile', async (req, res) => {
    await User.findByIdAndDelete(req.session.user._id);
    res.redirect('/auth/sign-up');
});

// Module export
module.exports = router;