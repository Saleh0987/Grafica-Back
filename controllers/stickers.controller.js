let {stickers} = require("../data/stickers");
const {validationResult} = require("express-validator");
const Sticker = require("../models/sticker.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const AppError = require("../utils/appError");

const getAllStickers = asyncWrapper( async (req, res, next) => {
    const stickers = await Sticker.find({}, {__v: false});
    res.json({status: httpStatusText.SUCCESS, data: {stickers}});
});

const getSticker = asyncWrapper(async (req, res, next) => {
  const sticker = await Sticker.findById(req.params.stickerId);
  if (!sticker) {
    const error = AppError.create(
      "Sticker not found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  res.json({status: httpStatusText.SUCCESS, data: {sticker}});
});

const addSticker = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }
  const newSticker = new Sticker(req.body);
  await newSticker.save();
  res.status(201).json({status: httpStatusText.SUCCESS, data: {newSticker}});
});
  
const updateSticker = asyncWrapper(async (req, res, next) => {
  const stickerId = req.params.stickerId;
  const updatedSticker = await Sticker.updateOne(
    {_id: stickerId},
    {$set: {...req.body}}
  );
  return res
    .status(200)
    .json({status: httpStatusText.SUCCESS, data: {updatedSticker}});
});

const deleteSticker = asyncWrapper(async (req, res, next) => {
  await Sticker.deleteOne({_id: req.params.stickerId});
  const stickerId = Number();
  stickers = stickers.filter((sticker) => sticker.id !== stickerId);
  res.status(200).json({status: httpStatusText.SUCCESS, data: null});
});

module.exports = {
  getAllStickers,
  getSticker,
  addSticker,
  updateSticker,
  deleteSticker,
}