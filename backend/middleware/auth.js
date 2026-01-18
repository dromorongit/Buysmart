// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;

  // Check if no token
  if (!token) {
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
   if (req.accepts('html')) {
     return res.redirect('/login');
   }
   res.status(401).json({ msg: 'Token is not valid' });
 }
};

// Admin role check
const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      if (req.accepts('html')) {
        return res.redirect('/login');
      }
      res.status(403).json({ msg: 'Admin access required' });
    }
  });
};

module.exports = { auth, adminAuth };