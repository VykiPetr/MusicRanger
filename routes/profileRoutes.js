const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/User.model");
const userDetailsModel = require("../models/UserDetails.model");
const UserDetailsModel = require("../models/UserDetails.model");
const bandModel = require("../models/Band.model");
let {allCountries} = require('../lib/countriesList');
let {mainRoleList} = require('../lib/mainRoleList');
let {mainGenreList} = require('../lib/mainGenreList');

router.get("/dashboard", (req, res) => {
  if (!req.session.loggedInUser) {
    res.status(500).render("index.hbs", { message: "Please sign up or login" });
  }
  let loggedInUser = req.session.loggedInUser;
  userDetailsModel
    .findOne({ userrefid: loggedInUser._id })
    .then((detailsData) => {
      res.render("profiles/dashboard", { loggedInUser, detailsData });
    })
    .catch((err) =>
      console.log("error in dasborad userDetailsModel.findOne ", err)
    );
});

router.get("/updateProfile", (req, res) => {
  let userId = req.session.loggedInUser._id;
  let loggedInUser = req.session.loggedInUser
  if (!loggedInUser){
    res.status(500).render("index.hbs", { message: "Please sign up or login to view this page" })
    return;
  }
  userModel
    .findById(userId)
    .then((userDataMain) => {
      console.log("usermodel main data: ", userDataMain);
      userDetailsModel
        .findOne({ userrefid: userId })
        .then((detailsData) => {
          res.render("profiles/updateProfile", { userDataMain, detailsData, allCountries, mainRoleList, mainGenreList });
        })
        .catch((err) =>
          res.redirect('/updateProfile')
        );
    })
    .catch((err) =>
      console.log("error in updateProfile userModel.findById ", err)
    );
});

router.post("/updateProfile", (req, res) => {
  let userId = req.session.loggedInUser._id;
  let loggedInUser = req.session.loggedInUser;
  if (!loggedInUser){
    res.status(500).render("index.hbs", { message: "Please sign up or login to view this page" })
    return;
  }
  let { username, img, mainGenre, mainRole, country, listed } = req.body;
  let {
    description,
    subGenre,
    subRole,
    city,
    facebookurl,
    instagramurl,
    youtubeurl,
    soundcloudurl,
    spotifyurl,
  } = req.body;
  if (listed) {
    listed = true;
  } else {
    listed = false;
  }
  userModel
    .findByIdAndUpdate(
      userId,
      { username, img, mainGenre, mainRole, country, listed },
      { new: true, runValidators:true } //run validators used for allCountries enum. 
    )
    .then((userData) => {
      userDetailsModel
        .findOneAndUpdate(
          { userrefid: userId },
          {
            description,
            subGenre,
            subRole,
            city,
            facebookurl,
            instagramurl,
            youtubeurl,
            soundcloudurl,
            spotifyurl,
          }
        )
        .then(() => {
          req.session.loggedInUser = userData;
          res.redirect("/dashboard");
        })
        .catch((err) => 
          res.redirect('/updateProfile')
        );
    });
});

router.get("/musicianProfile/:id", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  if (!loggedInUser){
    res.status(500).render("index.hbs", { message: "Please sign up or login to view this page" })
    return;
  }
  let id = req.params.id;
  //finding the main user model
  userModel.findById(id)
  .then((userProfile) => {
    //getting the user details by refferencing their id in the details model
    UserDetailsModel.findOne({ userrefid: id })
    .populate('bandurllinks')
    .then((detailsData) => {
      let bands = detailsData.bandurllinks
      res.render("profiles/musicianProfileDetail", {
        userProfile,
        detailsData,
        bands,
        loggedInUser,
      });
    });
  });
});

router.get("/bandView/:id", (req, res) => {
  let loggedInUser = req.session.loggedInUser;
  if (!loggedInUser){
    res.status(500).render("index.hbs", { message: "Please sign up or login to view this page" })
    return;
  }
  
  let id = req.params.id;
  //finding the required band profile by the id from the url using the model
  bandModel.findById(id)
  .then((bandProfile) => {
    res.render("bands/bandView", { bandProfile, loggedInUser });
  });
});

module.exports = router;
