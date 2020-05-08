const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  // username: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // firstName: String,
  password: {
    type: String,
    required: false,
  },
  // userType: {
  //   type: Number,
  //   required: true,
  //   default: 2,
  // },
  // appearInUserView: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)
