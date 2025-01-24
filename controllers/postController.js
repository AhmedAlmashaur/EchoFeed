
const express = require('express');

const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated');
/*------------------ Models ------------------*/

const Post = require('../models/Post');

/*------------------ Routes ------------------*/

// Find posts by a single user
router.get('/user/:userId/posts', async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId });
        res.json(posts);
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

// Find all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('user');
        res.json(posts);
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

// Add a post
router.post('/posts', isAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({
            user: req.session.userId,
            title,
            content
        });

        await newPost.save();
        res.send('Post added');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

// Edit a post
router.put('/posts/:postId', isAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findByIdAndUpdate(req.params.postId, { title, content }, { new: true });
        if (!post) {
            return res.status(400).send('Post not found');
        }
        res.send('Post updated');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

// Delete a post
router.delete('/posts/:postId', isAuthenticated, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.send('Post deleted');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

module.exports = router;
