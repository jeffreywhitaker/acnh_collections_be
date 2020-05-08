// const JwtStrategy = require('passport-jwt').Strategy
// const GoogleStrategy = require('passport-google-oauth20')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const passport = require('passport')
const { BACKEND_ROOT_DOMAIN } = require('./envConfig')

passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (user, done) {
  done(null, user)
})

// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// opts.secretOrKey = process.env.JWT_TOKEN_SECRET

module.exports = (passport) => {
  passport.use(
    new CookieStrategy((token, done) => {
      User.findByToken({ token: token }, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false)
        }
        return done(null, user)
      })
    }),
  )
}
