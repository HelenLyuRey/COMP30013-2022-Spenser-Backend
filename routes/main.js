const express = require("express");
const router = express.Router();

const food = require("../routes/food");

router.use("/food", food);

module.exports = router;
