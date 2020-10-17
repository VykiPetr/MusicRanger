const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/User.model');
const userDetailsModel = require('../models/UserDetails.model')

router.get('/dashboard', (req, res) => {
    if (!req.session.loggedInUser) {
        res.status(500).render('index.hbs', {message: 'Please sign up or login'})
    }
    let loggedInUser = req.session.loggedInUser
    res.render('profiles/dashboard', {loggedInUser})
    console.log(loggedInUser)
})

router.get('/updateProfile', (req, res) =>{
    let userId = req.session.loggedInUser._id
    console.log('user Id ',userId)
    userModel.findById(userId)
        .then((userDataMain)=>{
            console.log('usermodel main data: ', userDataMain)
            userDetailsModel.findById(userId)
                .then((detailsData)=>{
                    console.log('details model data: ', detailsData)
                    res.render('profiles/updateProfile', {userDataMain, detailsData})
                })
                .catch((err)=>console.log('error in updateProfile userDetailsModel.findOne ', err))
        })
        .catch((err)=>console.log('error in updateProfile userModel.findById ', err))
})

router.post('/updateProfile', (req, res)=>{
    let userId = req.session.loggedInUser._id
    let {username,  img, mainGenre,  mainRole,  country,  listed} = req.body
    let {description, subGenre, subRole, city, facebookurl, instagamurl, youtubeurl,soundcloudurl, spotifyurl} = req.body
    if (listed) {
        listed = true
    } else {
        listed = false
    }
    userModel.findByIdAndUpdate(userId, {username,  img, mainGenre,  mainRole,  country,  listed})
        .then((userData)=>{
            userDetailsModel.findByIdAndUpdate(userId, {description, subGenre, subRole, city, facebookurl, instagamurl, youtubeurl,soundcloudurl, spotifyurl})
            .then(()=>{
                req.session.loggedInUser = userData
                res.redirect('/dashboard')
            })
        })
    // console.log(req.body)
})

module.exports = router;