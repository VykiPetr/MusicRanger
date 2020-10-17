const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/User.model');
const userDetailsModel = require('../models/UserDetails.model')


router.get('/viewAll', (req, res) => {
    if(req.params.listed)
    userModel.find()
    .then((user)=>{
        res.render('listings/viewAll', {user})
    })
})


module.exports = router;