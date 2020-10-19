const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/User.model");
const userDetailsModel = require("../models/UserDetails.model");
const bandModel = require("../models/Band.model");

router.get("/musicianListings", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  userModel.find({ listed: true }).then((user) => {
    res.render("listings/viewAll", { user, loggedInUser });
  });
});

router.get("/searchMusiciansResults", (req, res, next) => {
  let loggedInUser = req.session.loggedInUser;
  let query = req.query;
  let searchParams = {};
  // {genre: "Rock", mainrole: "Vocals", city:""}
  // {key: ubndefined}
  for (let key in query) {
    if (query[key]) {
      searchParams[key] = query[key];
    }
  }
  userModel.find(searchParams).then((results) => {
    res.render("listings/searchMusiciansResults", { results });
  });
  //res.send(req.query)
});

router.get("/bandListings", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  bandModel.find().then((band) => {
    res.render("listings/viewAllBands", { band, loggedInUser });
  });
});

router.get("/searchResultsBands", (req, res, next) => {
  let loggedInUser = req.session.loggedInUser;
  let query = req.query;
  let searchParams = {};
  // {genre: "Rock", mainrole: "Vocals", city:""}
  // {key: ubndefined}
  for (let key in query) {
    if (query[key]) {
      searchParams[key] = query[key];
    }
  }
  bandModel.find(searchParams)
  .then((results) => {
    res.render("listings/searchResults", { results });
  });
  //res.send(req.query)
});

module.exports = router;
