const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/User.model");
const userDetailsModel = require("../models/UserDetails.model");

router.get("/viewAll/", (req, res) => {
  userModel.find({listed: true})
  .then((user) => {
    res.render("listings/viewAll", { user });
  });
});

module.exports = router;
