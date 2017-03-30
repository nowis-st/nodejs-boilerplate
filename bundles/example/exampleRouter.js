/**
 * Example router
 * @author Simon Tannai <tannai.simon@gmail.com>
 * @license MIT
 * @todo: Nothing
 */

const path = require('path')
const express = require('express')

const router = express.Router()

const exampleController = require(path.join(__dirname, 'exampleController.js'))
const logger = require(path.join(__dirname, '..', '..', 'core', 'Logger.js'))

/**
 * @api {get} /:query Return something
 * @apiName Query
 * @apiGroup Example
 *
 * @apiParam {String} query Query string.
 *
 * @apiSuccess {String} someVar Some string.
 * @apiError NotFound Something appends !
 */
router.post('/', (req, res) => {
  let response

  if (!req.body.query) {
    logger.error('No query')
    response = res.status(403).send()
  } else {
    const someVar = exampleController.someFunction()
    response = res.status(200).send(someVar)
  }

  return response
})

/**
 * Export router
 * @type {Object}
 */
module.exports = router
