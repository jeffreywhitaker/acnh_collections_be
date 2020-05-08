require('dotenv').config()
const DB = require('./config/dbConfig')
const server = require('./server.js')

// start server on port
const port = process.env.PORT || 5000
DB.connectDB().then(() => {
  server.listen(port, () => {
    console.log(
      `ACNH Collections server is listening on http://localhost:${port}!`,
    )
  })
})
