/**
 * Logger
 * @author: Simon Tannai <tannai.simon@gmail.com>
 * @license: MIT
 * @todo: Nothing
 */

const log4js = require('log4js')
const path = require('path')
const fs = require('fs')

let logger

// If production, write logs into file
if (process.env.NODE_ENV === 'production') {
  // Get log4js configuration file
  const log4jsConfigPath = path.join(__dirname, '..', 'config', 'log4js.json')

  // Get log4js configuration
  const log4jsConfig = require(log4jsConfigPath)

  // Ensure log directory exists
  if (!fs.existsSync(path.dirname(log4jsConfig.appenders[0].filename))) {
    // If not, creating it
    fs.mkdirSync(path.dirname(log4jsConfig.appenders[0].filename))
  }

  // Set path to his configuration
  log4js.configure(log4jsConfigPath)

  // Get the "log" logger
  logger = log4js.getLogger('log')
} else {
  logger = log4js.getLogger()
}

module.exports = logger
