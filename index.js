const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const database = require('./Api/configs/database')
const apiRoute = require('./Api/RouteApi/index.route')
var cors = require('cors')

app.use(cors())
app.use(express.json());


database.connect();
apiRoute(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})