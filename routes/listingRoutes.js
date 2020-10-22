const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/User.model");
const userDetailsModel = require("../models/UserDetails.model");
const bandModel = require("../models/Band.model");
let {allCountries} = require('../lib/countriesList');
let {allCountriesSearch} = require('../lib/countriesSearchList')
let {searchRoleList} = require('../lib/searchRoleList')
let {searchGenreList} = require('../lib/searchGenreList')


router.get("/musicianListings", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  console.log(searchGenreList)
  userModel.find({ listed: true })
  .then((user) => {
    res.render("listings/viewAllMusicians", { user, loggedInUser, allCountriesSearch, searchGenreList, searchRoleList });
  });
});

router.get("/searchMusiciansResults", (req, res, next) => {
  let loggedInUser = req.session.loggedInUser;
  if (!loggedInUser){
    res.status(500).render("index.hbs", { message: "Please sign up or login to search listings" })
    return;
  }
  let query = req.query;
  let searchParams = {};
  // {genre: "Rock", mainrole: "Vocals", city:""}
  // {key: undefined}
  for (let key in query) {
    if (query[key]) {
      searchParams[key] = query[key];
    }
  }
  
  userModel.find(searchParams).then((results) => {
    res.render("listings/searchMusiciansResults", { results , loggedInUser});
  });
  
  //res.send(req.query)
});

router.get("/bandListings", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  bandModel.find()
  .then((band) => {
    res.render("listings/viewAllBands", { band, loggedInUser, allCountriesSearch });
  });
});

router.get("/searchBandsResults", (req, res, next) => {
  let loggedInUser = req.session.loggedInUser;
  if (!loggedInUser){
    res.status(500).render("index.hbs", { message: "Please sign up or login to search listings" })
    return;
  }
  let query = req.query;
  let searchParams = {};
  // {genre: "Rock", mainrole: "Vocals", city:""}
  // {key: ubndefined}
  console.log(searchParams)
  for (let key in query) {
    if (query[key]) {
      searchParams[key] = query[key];
    }
  }
  bandModel.find(searchParams)
  .then((results) => {
    res.render("listings/searchBandResults", { results , loggedInUser});
  });
});

module.exports = router;
