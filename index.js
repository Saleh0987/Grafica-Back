require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
app.use("/uploads",express.static(path.join(__dirname, "uploads")));
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
const httpStatusText = require("./utils/httpStatusText");

mongoose.connect(url).then(() => {
  console.log("Connected to the database!");
});

app.use(cors());
app.use(express.json());

const stickersRoute = require("./routes/stickers.route");
const usersRoute = require("./routes/users.route");

app.use("/api/stickers", stickersRoute);
app.use("/api/users", usersRoute);


app.all("*", (req, res, next) => {
  return res
    .status(404)
    .json({
      status: httpStatusText.ERROR,
      message: "this resourse is not avalibale",
      code: 404,
    });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
})


app.listen(3000|| 3001, () => {
  console.log("Server is running on port 3000");
});

