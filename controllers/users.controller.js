const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await User.find({}, {__v: false, password: false});
  res.json({status: httpStatusText.SUCCESS, data: {users}});
});

const register = asyncWrapper(async (req, res, next) => {
  const {firstName, lastName, email, password, role} = req.body;

  const oldUser = await User.findOne({email: email});
  if (oldUser) {
    const error = AppError.create(
      "user already exists",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();

  res.status(201).json({status: httpStatusText.SUCCESS, data: {newUser}});
});

const login = asyncWrapper(async (req, res, next) => {
  const {email, password} = req.body;
  if (!email && !password) {
    const error = AppError.create(
      "Please provide email and password",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({email: email});
  if (!user) {
    const error = AppError.create("user not found", 404, httpStatusText.FAIL);
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (user && matchedPassword) {
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    return res.json({status: httpStatusText.SUCCESS, data: {token}});
  } else {
    const error = AppError.create("smoething wrong", 500, httpStatusText.ERROR);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
