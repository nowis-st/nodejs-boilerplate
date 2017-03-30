/**
 * Example router
 * @author Simon Tannai <tannai.simon@gmail.com>
 * @license MIT
 * @todo: Nothing
 */

const path = require('path')

const ClassCore = require(path.join(__dirname, '..', '..', 'core', 'ClassCore.js'))

module.exports = class Example extends ClassCore {
  /**
   * Class constructor
   */
  constructor() {
    // Call parent's constructor
    super()

    // Set attribut
    this.something = 'This is amazing !'
  }
}
