/* -------------- Express-initialization ---------------- */
const express = require('express');
const app = express();
const port = 3000;

/* -------------- Static-folder ---------------- */
app.use(express.static(path.join(__dirname, 'public')));

/* -------------- dotenv ---------------- */
require('dotenv').config();


/* -------------- Morgan ---------------- */
const morgan = require('morgan');
app.use(morgan('dev'));


/* -------------- Body-Parser ---------------- */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* -------------- Express-session ---------------- */
const session = require('express-session');



/* -------------- EJS-Initialization ---------------- */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


/* -------------- Method-Override ---------------- */
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


/* -------------- Mongoose ---------------- */
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch(err => console.error(err));


/* -------------- Middleware ---------------- */
//urlencoded
app.use(express.urlencoded({ extended: true }));

// Session creation
app.use(methodOverride("_method"));
app.use(morgan('dev'));
// new
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

/* -------------- Routes ---------------- */
//home route
app.get('/', (req, res) => {
  res.render('pages/home.ejs');
});

/* -------------- Controllers ---------------- */
//for the authentification controller
const authController = require("./controllers/auth.js");
app.use('/auth', authController);

//for the user controller
const usersController = require("./controllers/users.js");
app.use('/users', usersController);

//for the posts controller
const postsController = require("./controllers/posts.js");
app.use('/posts', postsController);

//for the comments controller
const commentsController = require("./controllers/comments.js");
app.use('/comments', commentsController);

//for the bookmarks controller
const bookmarksController = require("./controllers/bookmarks.js");
app.use('/bookmarks', bookmarksController);


/* -------------- App-Listener ---------------- */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
