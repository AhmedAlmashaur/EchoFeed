# EchoFeed

EchoFeed is a simple social media application built with Node.js, Express, and MongoDB. Users can register, log in, create posts, edit posts, and delete posts. The application also includes user authentication and authorization.

## Features

- User registration and login
- Create, edit, and delete posts
- View posts by a single user
- View all posts
- User authentication and authorization
- Responsive design using Bootstrap

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS (Embedded JavaScript templates)
- Bootstrap

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/EchoFeed.git
   cd EchoFeed
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/echofeed
   SESSION_SECRET=your_secret_key
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```plaintext
EchoFeed/
├── models/
│   ├── Post.js
│   └── User.js
├── public/
│   ├── images/
│   │   └── default-profile-pic.jpg
│   └── css/
│       └── styles.css
├── routes/
│   ├── auth.js
│   └── postController.js
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── nav.ejs
│   └── index.ejs
├── .env
├── app.js
├── package.json
└── README.md
```
