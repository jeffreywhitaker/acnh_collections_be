const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

const connectDB = () => {
  return mongoose.connect(MONGODB_URI, {
    // useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
}

mongoose.connection.once('open', () => {
  console.log('Connected to Database')
})

module.exports = {
  connectDB: connectDB,
}
