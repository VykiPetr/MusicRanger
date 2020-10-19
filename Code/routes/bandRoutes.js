const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/User.model');
const userDetailsModel = require('../models/UserDetails.model')
const bandModel = require('../models/Band.model');


router.get('/managebands', (req, res) => {
    let loggedInUser = req.session.loggedInUser
    let userId = req.session.loggedInUser._id
    userDetailsModel.findOne({
            userrefid: userId
        })
        .populate('bandurllinks')
        .then((userDetailData) => {
            console.log(userDetailData)
            let bands = userDetailData.bandurllinks
            res.render('bands/manageBands.hbs', {
                userDetailData,
                bands,
                loggedInUser
            })
        })
})


router.get('/managebands/createBand', (req, res) => {
    let userId = req.session.loggedInUser._id
    res.render('bands/createBand')
})

router.post('/createBand', (req, res) => {
    let {
        bandName,
        img,
        description,
        mainGenre,
        subGenre,
        country,
        city,
    } = req.body
    let user = req.session.loggedInUser

    bandModel.create({
            bandName,
            img,
            description,
            mainGenre,
            subGenre,
            country,
            city,
            bandstructure: [{
                name: user.username,
                profileId: user._id,
                role: user.mainRole
            }]
        })
        .then((data) => {
            console.log(data)
            userDetailsModel.findOneAndUpdate({
                    userrefid: user._id
                }, {
                    $push: {
                        bandurllinks: data._id
                    }
                })
                .then(() => res.redirect('/managebands'))
                .catch((err) => console.log('error in updating the users band links in /createband model.create ', err))
        })
        .catch((err) => console.log("Error in create band ", err))
})

router.get('/bandEdit/:id', (req, res) => {
    let bandId = req.params.id
    bandModel.findOne(bandId)
        .then((bandData)=>{
            res.render('bands/bandEdit', {bandData})
        })
        .catch((err)=>console.log('error in fetching band data on edit ', err))

})

router.get('/bandDelete/:id', (req, res) => {
    let bandId = req.params.id
    userDetailsModel.updateMany({bandurllinks:bandId},{ $pull: {bandurllinks: bandId}})
        .then(() => {
            bandModel.findByIdAndDelete(bandId)
                .then(() => {
                    res.redirect('/managebands')
                })
                .catch((err) => console.log('error in deleting band ', err))
        })
        .catch((err)=>console.log('error in finding all users with the band id ', err))
})

router.get('/bandView/:id', (req, res) => {
    let bandId = req.params.id
    res.render('bands/bandView')

})
//trying to make fluid form
// router.get('/appendChild', (req, res) =>{
//     let structureForm = document.querySelector('.band-structure')
//     let {name, profileId, role} = req.body
//     console.log(req.body)

// })

module.exports = router;