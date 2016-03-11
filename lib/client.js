/**
 * The class that holds the state of a Heap Server-Side API client.
 *
 * @module heap-api/client
 * @private
 */

var events = require("events");
var util = require("util");
var Promise = require("any-promise");
var request = require("request");

var ApiError = require("./api_error.js");
var defaultUserAgent = require("./user_agent.js");
var Validator = require("./validations.js");

// NOTE: node.js 0.10 has EventEmitter as a property on events' exported
//       object, whereas in newer versions EventEmitter _is_ the exported
//       object.
var EventEmitter = ("EventEmitter" in events) ? events.EventEmitter : events;


/**
 * Creates a new client for the Heap server-side API.
 *
 * @constructor
 * @param {string} appId the Heap application ID from
 *   https://heapanalytics.com/app/install
 * @param {Object} options defined below
 * @param {boolean} options.stubbed if true, this client makes no Heap API
 *   calls
 * @param {string} options.userAgent the User-Agent header value used by this
 *   Heap API client
 * @alias heap-api.Client
 */
function Client(appId, options) {
  this.appId = appId;
  this.stubbed = false;
  this.userAgent = defaultUserAgent;
  this._validator = new Validator();

  // NOTE: We need to add a listener to the "error" event so the users aren't
  //       forced to set up a listener themselves. If no listener for "error"
  //       exists, emitting the event results in an uncaught error.
  this.on("error", function() { });

  if (options) {
    for (var property in options) {
      if (!options.hasOwnProperty(property))
        continue;
      this[property] = options[property];
    }
  }
};
util.inherits(Client, EventEmitter);
module.exports = Client;

/**
 * Fired when an API call fails.
 *
 * @event heap-api.Client#error
 * @type {heap-api.ApiError}
 */


/**
 * Assigns custom properties to an existing user.
 *
 * @param {string} identity an e-mail, handle, or Heap-generated user ID
 * @param {Object<string, string|number>} properties key-value properties
 *   associated with the event; each key must have fewer than 1024 characters;
 *   each value must be a Number or String with fewer than 1024 characters
 * @param {?function(Error)} callback called when the API call completes; error
 *   is undefined if the API call succeeds
 * @returns {Promise<boolean>} resolved with true if the API call completes
 *   successfully; rejected if the API call fails
 * @emits heap-api.Client#error
 * @see https://heapanalytics.com/docs/server-side#identify
 */
Client.prototype.addUserProperties = function(identity, properties, callback) {
  options = {
    url: "https://heapanalytics.com/api/identify",
    json: {
      app_id: this._validator.normalizeAppId(this.appId),
      identity: this._validator.normalizeIdentity(identity),
      properties: this._validator.normalizeProperties(properties),
    },
  };

  return this._request(options, callback);
};

/**
 * Sends a custom event to the Heap API servers.
 *
 * @param {string} eventName the name of the server-side event; limited to 1024
 *   characters
 * @param {string} identity an e-mail, handle, or Heap-generated user ID
 * @param {Object<string, string|number>} properties key-value properties
 *   associated with the event; each key must have fewer than 1024 characters;
 *   each value must be a number or string with fewer than 1024 characters
 * @param {?function(Error)} callback called when the API call completes; error
 *   is undefined if the API call succeeds
 * @returns {Promise<boolean>} resolved with true if the API call completes
 *   successfully; rejected if the API call fails
 * @emits heap-api.Client#error
 * @see https://heapanalytics.com/docs/server-side#track
 */
Client.prototype.track = function(eventName, identity, properties, callback) {
  options = {
    url: "https://heapanalytics.com/api/track",
    json: {
      app_id: this._validator.normalizeAppId(this.appId),
      event: this._validator.normalizeEventName(eventName),
      identity: this._validator.normalizeIdentity(identity),
    },
  };
  if (typeof(properties) === "function")
    callback = properties;
  else if (properties)
    options.json.properties = this._validator.normalizeProperties(properties);

  return this._request(options, callback);
};

/**
 * The Heap application ID used by this Heap API client.
 * @member {string}
 */
Client.prototype.appId = null;

/**
 * The User-Agent header value used by this Heap API client.
 * @member {string}
 */
Client.prototype.userAgent = null;

/**
 * If true, this client makes no Heap API calls.
 *
 * The client behaves if the API calls have succeeded.
 *
 * @member {boolean}
 */
Client.prototype.stubbed = null;

/**
 * Heap API parameter validation state.
 *
 * @private
 * @member {heap-api/validations}
 */
Client.prototype._validator = null;

/**
 * Performs a HTTP request to the Heap APIs.
 *
 * @private
 * @param {Object} options the HTTP request arguments; the object can be
 *   modified by the callee
 * @param {?function(Error)} callback called when the API call completes; error
 *   is undefined if the API call succeeds
 * @returns {Promise<boolean>} resolved with true if the API call completes
 *   successfully; rejected if the API call fails
 * @emits heap-api.Client#error
 * @see https://www.npmjs.com/package/request
 */
Client.prototype._request = function(options, callback) {
  var validationError = this._validator.error;
  if (validationError !== null) {
    this._validator.error = null;
    this.emit("error", validationError);
    if (callback) {
      process.nextTick(function() {
        callback(validationError);
      });
    }
    return Promise.reject(validationError);
  }

  if (this.stubbed) {
    if (callback)
      process.nextTick(callback);
    return Promise.resolve(true);
  }

  options.method = "POST";
  options.headers = { "User-Agent": this.userAgent };

  var _this = this;
  return new Promise(function(resolve, reject) {
    request(options, function (error, response) {
      if (error) {
        response = null;
      } else {
        if (response.statusCode >= 400)
          error = new ApiError(response, _this);
      }

      if (error) {
        _this.emit("error", error);
        reject(error);
        callback && callback(error);
        return;
      }

      resolve(true);
      callback && callback();
    });
  });
};
