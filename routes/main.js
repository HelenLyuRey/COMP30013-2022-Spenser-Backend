const express = require("express");
const router = express.Router();

const food = require("../routes/food");
const auth = require("../routes/auth");

router.use("/food", food);
router.use("/auth", auth);

module.exports = router;
