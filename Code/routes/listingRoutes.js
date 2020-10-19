const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/User.model");
const userDetailsModel = require("../models/UserDetails.model");

router.get("/listings", (req, res) => {
  
  let loggedInUser = req.session.loggedInUser
      userModel.find({listed: true})
        .then((user) => {
        res.render("listings/viewAll", {user, loggedInUser});
      });
    });
  
router.get('/searchResults', (req, res, next) => {
  let loggedInUser = req.session.loggedInUser
  let query = req.query
  let searchParams = {}
  // {genre: "Rock", mainrole: "Vocals", city:""}
  // {key: ubndefined}
  for (let key in query){
      if (query[key]){
        searchParams[key] = query[key]

      }
  }
  userModel.find(searchParams)  
  .then((results) => {
    res.render('listings/searchResults', {results})
  })  
  //res.send(req.query)
    })

module.exports = router;
