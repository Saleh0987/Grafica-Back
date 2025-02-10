const express = require("express");
const router = express.Router();
const stickersController = require("../controllers/stickers.controller");
const { validationSchema } = require("../middleware/validationSchema");
const verfiyToken = require("../middleware/verfiyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middleware/allowedTo");

router
  .route("/")
  .get(stickersController.getAllStickers)
  .post(verfiyToken, validationSchema(), stickersController.addSticker);

router
  .route("/:stickerId")
  .get(stickersController.getSticker)
  .patch(stickersController.updateSticker)
  .delete(verfiyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER) ,stickersController.deleteSticker);

module.exports = router;