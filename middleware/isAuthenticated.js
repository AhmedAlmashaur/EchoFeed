function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    } else {
        res.status(401).redirect('/auth/login');
    }
}

module.exports = isAuthenticated;