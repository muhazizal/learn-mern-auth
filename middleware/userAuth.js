const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    // Check token exist
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(401).json({ message: "No authentication token, authorization denied." });
    }

    // Verify token
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenVerified) {
      return res.status(401).json({ message: "Token verification failed, authorization denied." });
    }

    req.user = tokenVerified.id;
    next();
  } catch (error) {}
};

module.exports = userAuth;
