// const JwtStrategy = require('passport-jwt').Strategy
// const GoogleStrategy = require('passport-google-oauth20')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
// const validPassword = require('../config/passwordUtils').validPassword
// const { BACKEND_ROOT_DOMAIN } = require('./envConfig')

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, cb) => {
        User.findOne({ email }).then((user) => {
          // Check if user exists
          if (!user) {
            return cb(null, false)
          }

          // Check password
          bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              // User matched
              return cb(null, user)
            } else {
              return cb(null, false)
            }
          })
        })
      },
    ),
  )

  passport.serializeUser((user, done) => {
    // console.log('cerealizing!');
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    // console.log('deserializing!');
    User.findById(id, (err, user) => {
      // console.log(user);
      done(err, user)
    })
  })
}
