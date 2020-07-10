const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Load User model and input validation
const User = require('../models/userModel')
const validateRegisterInput = require('../validation/register-validation')
const validateLoginInput = require('../validation/login-validation')

// @route POST auth/register
// @desc Register user and return cookie
// @access Public
router.post(
  '/register',
  signupValidation,
  passport.authenticate('local'),
  (req, res) => {
    return res.status(200).json('User created and logged in!') // send stuff back
  },
)

// @route POST auth/login
// @desc Login user and return cookie
// @access Public
router.post(
  '/login',
  loginValidation,
  passport.authenticate('local'),
  (req, res) => {
    return res.status(200).json("You're logged in!") // send stuff back
  },
)

// helper functions
function loginValidation(req, res, next) {
  // check for form validation
  const { errors, isValid } = validateLoginInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  return next()
}

function signupValidation(req, res, next) {
  // check for form validation
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }

  // check if user exists
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' })
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
      })

      // Hash password before saving in database
      bcrypt.genSalt(12, (err, salt) => {
        if (err) throw err
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then((user) => {
              return next()
            })
            .catch((err) => console.log(err))
        })
      })
    }
  })
}

module.exports = router
