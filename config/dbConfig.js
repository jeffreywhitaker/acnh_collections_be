const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

const connectDB = () => {
  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
}

mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:'),
)
mongoose.connection.once('open', () => {
  console.log('Connected to Database')
})

module.exports = {
  connectDB: connectDB,
}
