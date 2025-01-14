const jwt = require("jsonwebtoken");
const errorHandler = require("./error");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));
  
  jwt.verify(token, process.env.JWT_SECERT, (err, user) => {
    if (err) return next(errorHandler(403, "User not found please"));  
    req.user = user;
    next()
  });
};
module.exports = {verifyToken}