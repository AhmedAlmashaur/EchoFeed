module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // User is authenticated
    }
    res.redirect('/login'); // Redirect unauthenticated users
};
