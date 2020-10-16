const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/User.model');
const UserModel = require('../models/User.model');

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
                                        password: hashedPassword
                                    })
                                    .then(() => {
                                        res.redirect('/')
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
    const {email, password} = req.body

    if (!email || !password) {
        res.status(500).render('auth/login', {
            message: 'Please check your details'
        })
        return;
    }

    UserModel.findOne({email:email})
       .then((userData)=>{
        if (!userData) {
            res.status(500).render('auth/login', {message: 'User does not eist'})
            return;
        }
        bcrypt.compare(password, userData.password)
            .then((result)=>{
                if (result) {
                    req.session.loggedInUser = userData
                    res.redirect('/dashboard')
                    return;
                } else {
                    res.status(500).render('auth/login', {message: 'Password does not match'})
                }
            })
       })
})

router.get('/dashboard', (req, res) => {
    if (!req.session.loggedInUser) {
        res.status(500).render('/', {message: 'Please sign up or login'})
    }
    let loggedInUser = req.session.loggedInUser
    res.render('profiles/dashboard', {loggedInUser})
})


module.exports = router;