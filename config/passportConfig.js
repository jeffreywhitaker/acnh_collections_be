// const JwtStrategy = require('passport-jwt').Strategy
// const GoogleStrategy = require('passport-google-oauth20')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const validPassword = require('../config/passwordUtils').validPassword
// const { BACKEND_ROOT_DOMAIN } = require('./envConfig')

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(function (username, password, cb) {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            return cb(null, false)
          }

          const isValid = validPassword(password, user.hash, user.salt)

          if (isValid) {
            return cb(null, user)
          } else {
            return cb(null, false)
          }
        })
        .catch((err) => {
          cb(err)
        })
    }),
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((userId, done) => {
    User.findById(userId)
      .then((user) => {
        done(null, user)
      })
      .catch((err) => done(err))
  })
}
