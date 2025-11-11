const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if there is a token and it's in Bearer <token> format
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract token from header
    const token = authHeader.split(' ')[1];
    try {
      // Verify the token using your secret key from environment variable
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach userId and role from token payload to request object
      req.userId = decoded.userId;
      req.userRole = decoded.role; // Optional: if you want to check user role

      // Call the next middleware or route handler
      next();
    } catch (error) {
      // Token verification failed
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else {
    // Authorization token is missing
    res.status(401).json({ message: 'Authorization token missing' });
  }
};

module.exports = authMiddleware;
