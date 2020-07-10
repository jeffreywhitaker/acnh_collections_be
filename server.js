const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const passport = require('passport')
// const socialAuthRoutes = require('./routes/socialAuth')
const localAuthRoutes = require('./routes/localAuth')
const apiRoute = require('./routes/collectionsData')
const rateLimit = require('express-rate-limit')
const server = express()
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
require('dotenv').config()

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

// session middleware
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions',
})
server.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
)

// passport middleware
require('./config/passportConfig.js')(passport)
server.use(passport.initialize())
server.use(passport.session())

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
server.use('/api', backendLimiter, apiRoute)

module.exports = server
