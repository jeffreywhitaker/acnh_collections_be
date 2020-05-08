const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shoppingItemSchema = new Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('ShoppingItem', shoppingItemSchema)
