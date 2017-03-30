/**
 * NodeCore class
 * @author: Simon Tannai <tannai.simon@gmail.com>
 * @license: MIT
 * @todo: Nothing
 */

module.exports = class ClassCore {
  constructor() {
    /**
     * Path module from Node.js core
     * @type {Object}
     */
    this.path = require('path')

    /**
     * Logger object
     * @type {Object}
     */
    this.logger = require(this.path.join(__dirname, '/Logger.js'))
  }
}
