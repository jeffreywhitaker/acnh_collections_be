const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  shoppingCollection: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'ShoppingItem' },
  ],
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)
