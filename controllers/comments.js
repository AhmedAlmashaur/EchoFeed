// Initialize express router
const express = require('express');
const router = express.Router();

/*------------- Get routes ---------------*/

// Get comments by post id
router.get('/:postId', (req, res) => {
    Comment.find({ post: req.params.postId })
        .then(comments => res.send(comments))
        .catch(err => console.error(err));
});

// Get comments by user id
router.get('/user/:userId', (req, res) => {
    Comment.find({ user: req.params.userId })
        .then(comments => res.send(comments))
        .catch(err => console.error(err));
});

/*------------- Post routes ---------------*/

// Create a comment
router.post('/', (req, res) => {
    Comment.create(req.body)
        .then(comment => res.send(comment))
        .catch(err => console.error(err));
});

/*------------- Put routes ---------------*/

// Update a comment
router.put('/:id', (req, res) => {
    Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(comment => res.send(comment))
        .catch(err => console.error(err));
});

/*------------- Delete routes ---------------*/

// Delete a comment
router.delete('/:id', (req, res) => {
    Comment.findByIdAndDelete(req.params.id)
        .then(comment => res.send(comment))
        .catch(err => console.error(err));
});


// Export the router
module.exports = router;