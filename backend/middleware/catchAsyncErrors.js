/* the purpose of this code is to create a middleware function that takes an asynchronous function theFunc,
  which expects the standard Express middleware parameters (req, res, and next). It then wraps theFunc with error handling, 
 ensuring that any unhandled rejections from theFunc are caught and passed to the next middleware in the error-handling chain.
 */
module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};
