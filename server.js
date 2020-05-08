const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const passport = require('passport')
// const socialAuthRoutes = require('./routes/social-auth-routes')
const rateLimit = require('express-rate-limit')

const localAuthRoutes = require('./routes/localAuthRoutes')

const server = express()

// basic middleware
server.use(cors())
server.use(helmet())
server.use(morgan('combined'))
server.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
server.use(bodyParser.json())

// passport middleware
server.use(passport.initialize())
require('./config/passportConfig.js')(passport)

// rate limits for the routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
})

const backendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1000,
  message: 'Too many attempts, please try again after an hour',
})

// routes
server.use('/auth', authLimiter, [localAuthRoutes])
server.use('/api', backendLimiter, apiRouter)

module.exports = server
