const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/userModel')

// use query params
const url = require('url')

router.get('/', (req, res) => {
  // get query params from the url
  const queryObject = url.parse(req.url, true).query
  console.log('query object', queryObject)
  const criteria = {}
  let pageSize = 10
  let page = 1

  // handle publisher query
  if (queryObject['publisherId'] !== undefined) {
    criteria['publishers'] = queryObject['publisherId']
  }

  // handle composer query
  if (queryObject['composerId'] !== undefined) {
    criteria['composers'] = queryObject['composerId']
  }

  // handle title query
  if (queryObject['title'] !== undefined) {
    criteria['title'] = { $regex: queryObject['title'], $options: 'i' }
  }

  // handle series query
  if (queryObject['series'] !== undefined) {
    criteria['series'] = { $regex: queryObject['series'], $options: 'i' }
  }

  // handle genre query
  if (queryObject['genre'] !== undefined) {
    criteria['genres'] = { $regex: queryObject['genre'], $options: 'i' }
  }

  // handle multiplayer
  if (queryObject['multiplayer'] !== undefined) {
    criteria['multiplayer'] = queryObject['multiplayer']
  }

  // handle hd rumble
  if (queryObject['hdRumble'] !== undefined) {
    criteria['hdRumble'] = queryObject['hdRumble']
  }

  // handle cloudsaves
  if (queryObject['cloudSaves'] !== undefined) {
    criteria['cloudSaves'] = queryObject['cloudSaves']
  }

  // pagination
  if (queryObject['pageSize'] !== undefined) {
    pageSize = queryObject['pageSize']
  }

  if (queryObject['page'] !== undefined) {
    page = queryObject['page']
  }

  console.log('criteria', criteria)
  Game.find(criteria)
    .populate('publishers')
    .populate('directors')
    .populate('composers')
    .limit(pageSize + 1)
    .skip((page - 1) * pageSize)
    .exec((err, games) => {
      if (err) throw err
      console.log('endpoint hit')
      res.status(200).json(games)
    })
})

// @route GET auth/profile
// @desc Get user profile data
// @access Public
router.get(
  '/userdata',
  passport.authenticate('cookie', { session: true }),
  function (req, res) {
    res.json(req.user)
  },
)

router.get('/id/:id', (req, res) => {
  Game.find({ id: req.params.id })
    .populate('publishers')
    .populate('directors')
    .populate('composers')
    .exec((err, game) => {
      if (err) throw err
      res.status(200).json(game)
    })
})

router.get('/datalist', async (req, res) => {
  responseObj = {}

  const publishers = await Publisher.find({}).exec()
  responseObj['publishers'] = publishers

  const composers = await Composer.find({}).exec()
  responseObj['composers'] = composers

  res.status(200).json(responseObj)
})

module.exports = router
