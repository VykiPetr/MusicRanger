const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/User.model');
const userDetailsModel = require('../models/UserDetails.model')
const bandModel = require('../models/Band.model')

router.get('/managebands', (req, res)=>{
    let userId = req.session.loggedInUser._id
    userDetailsModel.findOne({serrefid: userId})
        .then((userDetailData)=>{
            res.render('bands/manageBands.hbs', {userDetailData})
        })
})


router.get('/managebands/createband', (req, res)=>{
    let userId = req.session.loggedInUser._id
    res.render('bands/createband')
})

router.post('/createband', (req, res)=>{
    let {bandname, img, description, mainGenre, subGenre, country, city, memName, profileId, memRole, bandlookingfor} = req.body
    let user = req.session.loggedInUser

    bandModel.create({bandname, img, description, mainGenre, subGenre, country, city, bandstructure:[{name:memName, role:memRole}, {name:user.username, profileId:user._id, role:user.mainRole}], bandlookingfor:[{bandlookingfor}] })
        .then(()=>{
            res.redirect('/managebands')
        })
})


//trying to make fluid form
// router.get('/appendChild', (req, res) =>{
//     let structureForm = document.querySelector('.band-structure')
//     let {name, profileId, role} = req.body
//     console.log(req.body)

// })

module.exports = router;