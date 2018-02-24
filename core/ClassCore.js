// =============================================================================
// Class core
// =============================================================================
/**
 * Import path library
 * @type {Object}
 * @private
 */
const path = require('path')

/**
 * Import logger object
 * @type {Logger}
 * @private
 */
const Logger = require(path.join(__dirname, 'Logger.js'))

/**
 * Import environment configuration. Based on NODE_ENV value
 * @type {[type]}
 */
const env = require(path.join(__dirname, '..', 'config', 'env.json'))[process.env.NODE_ENV]

/**
 * @class
 * @classdesc Core for class
 *
 * @author: Simon Tannai <tannai.simon@gmail.com> <simon.tannai@keyrus.com>
 * @license: UNLICENCED
 * @todo: Nothing
 */
class ClassCore {
  constructor() {
    /**
     * Path module from Node.js core
     * @type {Object}
     * @private
     */
    this.path = path

    /**
     * Logger object
     * @type {Object}
     * @private
     */
    this.logger = {
      log: new Logger('storm'),
      solrIods: new Logger('solr-iods'),
      targetsAutomate: new Logger('sa-targets-automate'),
      alertsAutomate: new Logger('alerts-automate'),
      automate: new Logger('automate'),
      zookeeperIo: new Logger('zookeeperIo'),
    }

    /**
     * Environment configuration
     * @type {Object}
     * @private
     */
    this.env = env
  }

  /**
   * Errors logging
   */
  buildError(code, name, msg) {
    if (typeof code !== 'number') {
      const err = new Error(`buildError: code parameter must be a number, ${typeof code} given. Details: ${JSON.stringify({code, name, msg})}`)

      this.logger.log.error(err)

      return err
    }

    if (typeof name !== 'string') {
      const err = new Error(`buildError: name parameter must be a string, ${typeof name} given. Details: ${JSON.stringify({code, name, msg})}`)

      this.logger.log.error(err)

      return err
    }

    if (typeof msg !== 'string') {
      const err = new Error(`buildError: msg parameter must be a string, ${typeof msg} given. Details: ${JSON.stringify({code, name, msg})}`)

      this.logger.log.error(err)

      return err
    }

    const err = new Error()

    err.code = code
    err.name = name
    err.message = msg

    return err
  }

  catchNodeInternalCtrl(methode, rejectCallback) {
    return (error) => {
      {
        const err = this.buildError(500, 'NodeInternal', `${methode}: ${error.message}`)
        this.logger.log.error(err)
        return rejectCallback(err)
      }
    }
  }
}

module.exports = ClassCore
