/**
 * CustomError responsible for generating error of custom type for front-end usage.
 * Code are not as per standard.
 * code for internal error => 300
 */

module.exports = function(heading, type, body) {
  let code;
  let msg = heading || "Something went wrong";

  if (type === "success") {
    code = 200;
  } else {
    code = 401;
  }

  if (type === "error") {
    if (typeof body === "object") {
      body = body.errmsg || body.message;
    }
  }
  // If record was deleted
  if (body === null) {
    body = "Record not exists";
    msg = "Record not exists";
  }
  return {
    msg,
    type,
    code,
    body
  };
};
