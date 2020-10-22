const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/User.model');
const userDetailsModel = require('../models/UserDetails.model')


router.get('/signup', (req, res) => {
  res.render('auth/signup.hbs')
})

router.post('/signup', (req, res) => {
  const {
    username,
    email,
    password
  } = req.body

  if (!username || !email || !password) {
    res.status(500).render('auth/signup', {
      message: 'Please enter your details'
    })
    return;
  }

  let emailReg = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
  if (!emailReg.test(email)) {
    res.status(500).render('auth/signup', {
      message: 'Please enter valid email'
    })
    return;
  }

  let passwordReg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/)
  if (!passwordReg.test(password)) {
    res.status(500).render('auth/signup', {
      message: 'Password must have one lowercase, one uppercase, a number, a special character and must be at least 8 characters long'
    })
    return;
  }

  userModel.findOne({
      username
    })
    .then((data) => {
      if (!data) {
        bcrypt.genSalt(10)
          .then((salt) => {
            bcrypt.hash(password, salt)
              .then((hashedPassword) => {
                userModel.create({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    img: "https://image-cdn.neatoshop.com/styleimg/53216/none/red/default/333247-20;1480539702v.jpg"
                  })
                  .then((userData) => {
                    userDetailsModel.create({
                        userrefid: userData._id
                      })
                      .then(() => {
                        console.log('userData after you signup button pressed '.userData)
                        req.session.loggedInUser = userData
                        res.redirect('/dashboard')
                      })
                  })
                  .catch(() => {
                    console.log('error in UserModel.Create')
                    res.status(500).render('auth/signup.hbs', {
                      message: 'Email already used, please choose a different email'
                    })
                    return
                  })
              })
              .catch(() => console.log('error in hashedpassword'))
          })
          .catch(() => console.log('Error in genSalt'))
      } else {
        res.status(500).render('auth/signup.hbs', {
          message: 'Username already used, please choose a different username'
        })
        return
      }
    })
    .catch(() => console.log('Failed in post/signup usermodel.findOne'))
})
router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.post('/login', (req, res) => {
  const {
    email,
    password
  } = req.body

  if (!email || !password) {
    res.status(500).render('auth/login', {
      message: 'Please check your details'
    })
    return;
  }

  userModel.findOne({
      email: email
    })
    .then((userData) => {
      if (!userData) {
        res.status(500).render('auth/login', {
          message: 'User does not eist'
        })
        return;
      }
      bcrypt.compare(password, userData.password)
        .then((result) => {
          if (result) {
            req.session.loggedInUser = userData
            res.redirect('/dashboard')
            return;
          } else {
            res.status(500).render('auth/login', {
              message: 'Password does not match'
            })
          }
        })
    })
})



router.get('/logout', (req, res) => {
  req.session.destroy()
  res.render('auth/login.hbs', {
    message: 'logged out succesfully'
  })
})




module.exports = router;