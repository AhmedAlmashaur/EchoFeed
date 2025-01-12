// Initialize express router
const express = require('express');
const router = express.Router();

/*------------- Get routes ---------------*/
// Get my bookmarks
router.get('/', (req, res) => {
    res.render('bookmarks/index.ejs', {
        bookmarks: req.session.user.bookmarks
    });
});

/*------------- Post routes ---------------*/
// Create a new bookmark
router.post('/', (req, res) => {
    req.session.user.bookmarks.push(req.body);
    res.redirect('/bookmarks');
});

/*------------- Delete routes ---------------*/
// Delete a bookmark
router.delete('/:id', (req, res) => {
    req.session.user.bookmarks.splice(req.params.id, 1);
    res.redirect('/bookmarks');
});

// Export the router
module.exports = router;