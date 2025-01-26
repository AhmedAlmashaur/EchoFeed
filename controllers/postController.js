const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const Post = require('../models/Post');

// Find posts by a single user
router.get('/user/:userId/posts', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId }).populate('author', 'username email profilePic');
        res.render('pages/user-posts', { posts }); // Render a page to display user-specific posts
    } catch (err) {
        req.flash('error', `Error fetching posts: ${err.message}`);
        res.redirect('/error'); // Redirect to an error page
    }
});

// Find all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email profilePic');
        res.render('/', { posts }); // Render a page to display all posts
    } catch (err) {
        req.flash('error', `Error fetching all posts: ${err.message}`);
        res.redirect('/error'); // Redirect to an error page
    }
});

// Get a single post by ID
router.get('/posts/:postId', isAuthenticated, async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ error: `Error fetching post: ${err.message}` });
    }
  });
  
// Add a post
router.post('/posts', isAuthenticated, async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validate input
        if (!title || !content) {
            req.flash('error', 'Title and content are required.');
            return res.redirect('/auth/profile'); // Redirect back to the post creation page
        }

        const newPost = new Post({
            author: req.session.userId,
            title,
            content,
        });

        await newPost.save();
        req.flash('success', 'Post created successfully.');
        res.redirect('/auth/profile'); // Redirect to the all posts page
    } catch (err) {
        req.flash('error', `Error creating post: ${err.message}`);
        res.redirect('/auth/profile'); // Redirect back to the post creation page
    }
});

// Edit a post
router.post('/edit', isAuthenticated, async (req, res) => {
  try {
    const { postId, title, content } = req.body;

    console.log("Received Data:", req.body); // Log full request body
    console.log("Post ID:", postId);
    console.log("Title:", title);
    console.log("Content:", content);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.author.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Unauthorized to edit this post.' });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.status(200).json({ message: 'Post updated successfully.', post });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: `Error updating post: ${err.message}` });
  }
});


// DELETE /post/:postId
router.delete('/:postId', isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Check if the current user is the author
    if (post.author.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this post.' });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: `Error deleting post: ${err.message}` });
  }
});

module.exports = router;


