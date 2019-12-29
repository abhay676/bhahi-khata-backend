/**
 * CustomError responsible for generating error of custom type for front-end usage.
 */

module.exports = function(type, title) {
  return {
    variant: type,
    title
  };
};
