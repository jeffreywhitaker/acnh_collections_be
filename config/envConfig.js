/* eslint-disable import/no-mutable-exports */

let BACKEND_ROOT_DOMAIN
let FRONTEND_ROOT_DOMAIN

const NODE_ENV = process.env.FORCE_NODE_ENV || process.env.NODE_ENV

if (NODE_ENV === 'development') {
  BACKEND_ROOT_DOMAIN = 'http://localhost:5000'
  FRONTEND_ROOT_DOMAIN = 'http://localhost:3000'
} else if (NODE_ENV === 'production') {
  BACKEND_ROOT_DOMAIN = 'placeholder'
  FRONTEND_ROOT_DOMAIN = 'placeholder'
}

module.exports = { BACKEND_ROOT_DOMAIN, FRONTEND_ROOT_DOMAIN }
