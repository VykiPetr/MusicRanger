const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/User.model');
const userDetailsModel = require('../models/UserDetails.model')
const bandModel = require('../models/Band.model');
const {
  render
} = require('../app');


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
  let loggedInUser = req.session.loggedInUser
  res.render('bands/createband.hbs', {
    loggedInUser
  })
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
  let loggedInUser = req.session.loggedInUser
  bandModel.findById(bandId)
    .then((bandData) => {
      bandData.bandstructure.forEach((e) => e.bandId = bandId)
      bandData.bandlookingfor.forEach((e) => e.bandId = bandId)
      res.render('bands/bandEdit', {
        bandData,
        loggedInUser
      })
    })
    .catch((err) => console.log('error in fetching band data on edit ', err))

})

router.post('/bandEdit/:id', (req, res) => {
  let bandId = req.params.id
  const {
    bandName,
    img,
    description,
    mainGenre,
    subGenre,
    country,
    city
  } = req.body
  bandModel.findByIdAndUpdate(bandId, {
      bandName,
      img,
      description,
      mainGenre,
      subGenre,
      country,
      city
    })
    .then(() => {
      res.redirect(`/bandEdit/${bandId}`)
    })
})

router.get('/bandDelete/:id', (req, res) => {
  let bandId = req.params.id
  userDetailsModel.updateMany({
      bandurllinks: bandId
    }, {
      $pull: {
        bandurllinks: bandId
      }
    })
    .then(() => {
      bandModel.findByIdAndDelete(bandId)
        .then(() => {
          res.redirect('/managebands')
        })
        .catch((err) => console.log('error in deleting band ', err))
    })
    .catch((err) => console.log('error in finding all users with the band id ', err))
})

router.get('/bandView/:id', (req, res) => {
  let bandId = req.params.id
  let loggedInUser = req.session.loggedInUser
  res.render('bands/bandView', {
    loggedInUser
  })

})

router.get('/manageBands/:id/addMember', (req, res) => {
  let bandId = req.params.id
  let loggedInUser = req.session.loggedInUser
  res.render('bands/addBandMember', {
    bandId,
    loggedInUser
  })
})

router.get('/manageBands/:id/addMember/search', (req, res) => {
  let bandId = req.params.id
  let search = req.query
  let loggedInUser = req.session.loggedInUser
  let {
    name
  } = req.body
  console.log(search)
  userModel.find(search)
    .then((user) => {
      //Jorge style cheat
      user.forEach((e) => e.bandId = bandId)
      res.render('bands/addBandMember', {
        bandId,
        loggedInUser,
        user
      })
    })



  // bandModel.findByIdAndUpdate(
  //         bandId
  //     , {
  //         $push: {
  //             bandstructure: {
  //                 name,
  //                 profileId,
  //                 role
  //             }
  //         }
  //     })
  //     .then(() => {
  //         userDetailsModel.findOneAndUpdate({
  //                 userrefid: profileId
  //             }, {
  //                 $push: {
  //                     bandurllinks: bandId
  //                 }
  //             })
  //             .then(() => {
  //                 res.redirect(`/bandEdit/${bandId}`)
  //             })
  //     })
})

router.get("/manageBands/:bandId/addMember/:userId", (req, res) => {
  let bandId = req.params.bandId
  let userId = req.params.userId
  userModel.findById(userId)
    .then((userMainData) => {
      userDetailsModel.findOneAndUpdate({
          userrefid: userId
        }, {
          $push: {
            bandurllinks: bandId
          }
        })
        .then(() => {
          bandModel.findByIdAndUpdate(bandId, {
              $push: {
                bandstructure: {
                  name: userMainData.username,
                  profileId: userMainData._id,
                  role: userMainData.mainRole
                }
              }
            })
            .then(() => {
              res.redirect(`/bandEdit/${bandId}`)
            })
        })
    })


})

router.get('/manageBands/:id/addMissing', (req, res) => {
  let loggedInUser = req.session.loggedInUser
  let bandId = req.params.id
  res.render('bands/addMissing', {
    bandId,
    loggedInUser
  })
})

router.post('/manageBands/:id/addMissing', (req, res) => {
  let loggedInUser = req.session.loggedInUser
  let bandId = req.params.id
  let {
    role
  } = req.body
  bandModel.findByIdAndUpdate(
      bandId, {
        $push: {
          bandlookingfor: role

        }
      })
    .then(() => {
      res.redirect(`/bandEdit/${bandId}`)
    })
})

router.get('/removeMember/:bandId/:userId', (req, res) => {
  let loggedInUser = req.session.loggedInUser
  let bandId = req.params.bandId
  let userId = req.params.userId
  console.log(bandId)
  console.log(userId)
  console.log('remove button clicked')
  userDetailsModel.updateOne({
      userrefid: userId
    }, {
      $pull: {
        bandurllinks: bandId
      }
    })
    .then(() => {
      bandModel.findByIdAndUpdate(
          bandId, {
            $pull: {
              bandstructure: {
                profileId: userId
              }
            }
          })
        .then(() => {
          res.redirect(`/bandEdit/${bandId}`)
        })
    })

})

router.get('/removeMember/:bandId/:name', (req, res) => {
  let loggedInUser = req.session.loggedInUser
  let bandId = req.params.bandId
  let name = req.params.name
})

router.get('/removeMissing/:bandId/:role', (req, res) => {
  let loggedInUser = req.session.loggedInUser
  let bandId = req.params.bandId
  let role = req.params.role
})

module.exports = router;