/**
 * Node.js boilerplate server
 * @author: Simon Nowis <tannai.simon@gmail.com>
 * @license: MIT
 * @todo: Nothing
 */

const path = require('path')
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const fileStreamRotator = require('file-stream-rotator')
const fs = require('fs')

const logger = require(path.join(__dirname, 'core', 'Logger.js'))

// Load environment configuration
const env = require(path.join(__dirname, 'config', 'env.json'))

const app = express()

// Use helmet for security
app.use(helmet())

// Use bodyParser for get POST params
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true,
}))

// Use CORS to enable Cross Domaine requests
app.use(cors())

// Define static foler who will contains the Webapp, like Angular.js
app.use(express.static(path.join(__dirname, 'webapp')))

/* =================================================================== *\
 *  LOG HTTP
\* =================================================================== */
if (process.env.NODE_ENV === 'production') {
  const logDirectory = path.join(__dirname, 'logs')

  // ensure log directory exists
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
  }

  // create a rotating write stream
  const accessLogStream = fileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false,
  })

  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }))
} else {
  app.use(morgan('combined'))
}
/* =================================================================== *\
 *  END OF LOG HTTP
\* =================================================================== */

app.get('/', (req, res) => {
  res.status(200).send('May the force be with you.')
})

/* =================================================================== *\
 *  ROUTES
\* =================================================================== */
// Import example router module
const exampleRouter = require(path.join(__dirname, 'bundles', 'example', 'exampleRouter.js'))

// Use example router
// All routes in example router will start by '/example'
app.use('/example', exampleRouter)
/* =================================================================== *\
 *  END OF ROUTES
\* =================================================================== */

/* =================================================================== *\
 *
 *  AMAZING CODE HERE
 *
\* =================================================================== */

const srv = app.listen(env[process.env.NODE_ENV].port, env[process.env.NODE_ENV].host, () => {
  logger.info('Server run on port', env[process.env.NODE_ENV].port, 'in', process.env.NODE_ENV, 'environment')
})

// Export server. He will be used by tests unit.
module.exports = srv
