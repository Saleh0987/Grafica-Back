const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");

const verfiyToken = (req, res, next) => {
 const authHeader = req.headers["Authorization"] || req.headers["authorization"];

 if (!authHeader) {
  const error = AppError.create("Token is required", 401, httpStatusText.FAIL);
  return next(error);
  }

 const token = authHeader.split(" ")[1];

 try {
  const currentUser = jwt.verify(token, process.env.JWT_SECRET);
  req.currentUser = currentUser;
  next();
 } catch (err) {
  const error = AppError.create("Invalid Token", 401, httpStatusText.FAIL);
  return next(error);
 }
};

module.exports = verfiyToken;