const jwt = require("jsonwebtoken");
const config = require("config");

// next is callback that we have to call so that it moves on to the next piece of middleware
module.exports = function (req, res, next) {
  // Get token  from the header
  const token = req.header("x-auth-token");

  // Check if not token
  // 401 means not authorized
  if (!token) {
    return res.status(401).json({ msg: "No Token, authorization denied" });
  }

  // Verify Token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
