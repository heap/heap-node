/**
 * Exception produced when a Heap API call fails.
 *
 * @module heap-api/api_error
 * @private
 */

var util = require("util");

/**
 * Creates an exception representing an error sent by the Heap API server.
 *
 * @constructor
 * @param {http.IncomingMessage} response the Heap API server's response
 * @param {heap-api.Client} client the Heap API client that received the error
 * @alias heap-api.ApiError
 */
function ApiError(response, client) {
  this.name = "heap.ApiError";
  this.response = response;
  this.client = client;
  this.message = this.toString();
  Error.captureStackTrace(this, ApiError);
};
util.inherits(ApiError, Error);
module.exports = ApiError;

/**
 * Computes this error's message.
 *
 * This method is defined because V8's exception API uses the exception's
 * toString() to compute the first frame of the stack trace.
 *
 * @private
 * @return {string} this exception's message
 */
ApiError.prototype.toString = function() {
  if (this.response) {
    return "Heap API server error " + this.response.statusCode + ": " +
        this.response.body;
  } else {
    return "Unknown Heap API server error";
  }
};

/**
 * The response received from the Heap API server.
 * @member {?http.IncomingMessage}
 */
ApiError.prototype.response = null;

/**
 * The client that experienced the error.
 * @member {heap-api.Client}
 */
ApiError.prototype.client = null;
