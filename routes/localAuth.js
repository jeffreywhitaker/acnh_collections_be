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
router.post('/register', (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

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
              return res.status(200).json("You're logged in") // send stuff back
            })
            .catch((err) => console.log(err))
        })
      })
    }
  })
})

// @route POST auth/login
// @desc Login user and return cookie
// @access Public
router.post('/login', passport.authenticate('local'), (req, res) => {
  return res.status(200).json("You're logged in!") // send stuff back
})

/**
 * (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body)

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }
  const email = req.body.email
  const password = req.body.password

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' })
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        return res.status(200).json("You're logged in!") // send stuff back
      } else {
        return res.status(400).json({ passwordincorrect: 'Password incorrect' })
      }
    })
  })
 */

module.exports = router
