/**
 * CustomError responsible for generating error of custom type for front-end usage.
 */

module.exports = function(title, type, code, body) {
  return {
    title,
    type,
    code,
    body
  };
};
