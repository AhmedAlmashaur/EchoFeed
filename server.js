/* -------------- Express-initialization ---------------- */
const express = require('express');
const app = express();
const port = 3000;

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
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch(err => console.error(err));

/* -------------- Middleware ---------------- */
// urlencoded
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

// custom middleware

/* -------------- Routes ---------------- */
app.get('/', (req, res) => {
  res.render('pages/home');
});

/* -------------- controllers ---------------- */
// authentication controller
const authController = require("./controllers/authController.js");
app.use('/auth', authController);

//post controller
const postController = require("./controllers/postController.js");
app.use('/post', postController);

//comment controller
const commentController = require("./controllers/commentController.js");
app.use('/comment', commentController);

/* -------------- App-Listener ---------------- */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});