const express = require('express')
const router = express.Router()
const passport = require('passport')

const ShoppingItem = require('../models/shoppingItem')
const User = require('../models/userModel')

// use query params
const url = require('url')

// @route GET auth/shoppingitms
// @desc Get list of nook shopping items, filtered
// @access Public
router.get('/shoppingitems', (req, res) => {
  // get query params from the url
  const queryObject = url.parse(req.url, true).query
  console.log('query object', queryObject)
  const criteria = {}
  let pageSize = 10
  let page = 1

  // pagination
  if (queryObject['pageSize'] !== undefined) {
    pageSize = queryObject['pageSize']
  }

  if (queryObject['page'] !== undefined) {
    page = queryObject['page']
  }

  console.log('criteria', criteria)
  ShoppingItem.find(criteria)
    // .populate('otherField')
    .limit(pageSize + 1)
    .skip((page - 1) * pageSize)
    .exec((err, items) => {
      if (err) throw err
      console.log('endpoint hit')
      res.status(200).json(items)
    })
})

// @route GET auth/userdata
// @desc Get user profile data
// @access Private
router.get('/userdata', isLoggedIn, function (req, res) {
  User.findOne({ email: req.body.email })
    .populate('shoppingCollection')
    .exec((err, collection) => {
      if (err) throw err
      res.status(200).json(collection)
    })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json('You must be logged in to access this.')
}

module.exports = router
