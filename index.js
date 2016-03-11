/**
 * Heap Server-Side API Client.
 *
 * @module heap-api
 */

var Client = require("./lib/client.js");

/**
 * Creates a new client for the Heap server-side API.
 *
 * @param {string} appId the Heap application ID from
 *   https://heapanalytics.com/app/install
 * @param {Object} options defined below
 * @param {boolean} options.stubbed if true, this client makes no Heap API
 *   calls
 * @param {string} options.userAgent the User-Agent header value used by this
 *   Heap API client
 * @returns {heap-api.Client} the new client
 */
module.exports = function(appId, options) {
  return new Client(appId, options);
};

module.exports.ApiError = require("./lib/api_error.js");
module.exports.Client = Client;
