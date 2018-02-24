const HTTPStatus = require('http-status-codes')
const path = require('path')

const LegacyError = require(path.join(__dirname, '..', 'errors', 'LegacyError.js'))
const BadParameterError = require(path.join(__dirname, '..', 'errors', 'BadParameterError.js'))
const UnauthorizedError = require(path.join(__dirname, '..', 'errors', 'UnauthorizedError.js'))

class ErrorHandler {
  constructor(logger){
    return (err, req, res, next) => {
      logger.error(err)

      if (err instanceof LegacyError) {
        return res.status(HTTPStatus.METHOD_FAILURE).json(err)
      } else if (err instanceof BadParameterError) {
        return res.status(HTTPStatus.UNPROCESSABLE_ENTITY).json(err)
      } else if (err instanceof UnauthorizedError) {
        return res.status(HTTPStatus.FORBIDDEN).json({})
      }

      return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({})
    }
  }
}


module.exports = ErrorHandler
