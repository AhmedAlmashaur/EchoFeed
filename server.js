/* -------------- Express Initialization ---------------- */
const express = require('express');
const app = express();
const port = 3000;

/* -------------- dotenv ---------------- */
require('dotenv').config();

/* -------------- Morgan ---------------- */
const morgan = require('morgan');
app.use(morgan('dev'));

/* -------------- Body Parser ---------------- */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* -------------- Method Override ---------------- */
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

/* -------------- Express Session ---------------- */
const session = require('express-session');
const flash = require('connect-flash');

// Initialize session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret', // Add fallback if env is missing
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  console.log('Session Data:', req.session);
  next();
});

// Flash middleware
app.use(flash());

// Pass flash messages and current path to all views
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error'),
  };
  res.locals.currentPath = req.path;
  next();
});

/* -------------- EJS Initialization ---------------- */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/* -------------- Mongoose ---------------- */
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

  const Post = require('./models/Post');
  const User = require('./models/User');

/* -------------- Routes ---------------- */
// Authentication controller
const authController = require('./controllers/authController.js');
app.use('/auth', authController);

// Post controller
const postController = require('./controllers/postController.js');
app.use('/post', postController);

// Home route
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username'); // Populate author's username
    res.render('pages/home', { user: req.session.currentUser || null, posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).send('Error fetching posts.');
  }
});


/* -------------- Middleware ---------------- */
const isAuthenticated = require('./middleware/isAuthenticated');

/* -------------- App Listener ---------------- */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
