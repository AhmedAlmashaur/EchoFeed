const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');

// Find comments for a post
router.get('/post/:postId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('user');
        res.json(comments);
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

// Add a comment to a post
router.post('/post/:postId/comments', isAuthenticated, async (req, res) => {
    try {
        const { content } = req.body;
        const newComment = new Comment({
            user: req.session.userId,
            post: req.params.postId,
            content
        });

        await newComment.save();
        res.send('Comment added');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

// Delete a comment
router.delete('/comments/:commentId', isAuthenticated, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.send('Comment deleted');
    } catch (err) {
        res.status(500).send('Error occurred');
    }
});

module.exports = router;