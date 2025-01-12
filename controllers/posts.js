// Initialize express router
const express = require('express');
const router = express.Router();

/*------------- Get routes ---------------*/

// Get all posts
app.get('/feed', (req, res) => {
    Post.find({}, (error, allPosts) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).send(allPosts);
    });
});

// Get one post
app.get('/feed/:id', (req, res) => {
    Post.findById(req.params.id, (error, foundPost) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).send(foundPost);
    });
});

// Get all posts by a specific user
app.get('/feed/user/:userId', (req, res) => {
    Post.find({ userId: req.params.userId }, (error, posts) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).send(posts);
    });
});

/*------------- Post routes ---------------*/

// Create a new post
app.post('/', (req, res) => {
    Post.create(req.body, (error, createdPost) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).send(createdPost);
    });
});

/*------------- Put routes ---------------*/

// Update a post
app.put('/update/:id', (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, updatedPost) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).send(updatedPost);
    });
});

/*------------- Delete routes ---------------*/

// Delete a post
app.delete('/delete/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, (error, deletedPost) => {
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(200).send(deletedPost);
    });
});

// Model exports
module.exports = router;