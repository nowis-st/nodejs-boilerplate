/**
 * Example controller
 * @author Simon Tannai <tannai.simon@gmail.com>
 * @license MIT
 * @todo: Nothing
 */

/**
 * Some function
 * @param  {Mixed} someParameter Some parameter
 * @return {Mixed}               Return parameter
 */
const someFunction = (someParameter) => {
  const result = someParameter + 10
  return result
}

/**
 * Export module with functions
 * @type {Object}
 */
module.exports = {
  someFunction: someFunction,
}
