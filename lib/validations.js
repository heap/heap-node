/**
 * Client-side validations for Heap API arguments.
 *
 * @module heap-api/validations
 * @private
 */

/**
 * Creates a context that stores validation errors.
 *
 * @private
 * @constructor
 */
function Validator() {
  this.error = null;
};

module.exports = Validator;

/**
 * Checks if the argument is a valid Heap API application ID.
 *
 * @private
 * @param {string} appId the application ID to be checked
 * @returns {?string} the normalized application ID, which will be passed to
 *   the Heap API; null if the application ID is not valid
 */
Validator.prototype.normalizeAppId = function(appId) {
  if (typeof(appId) !== "string") {
    this.error = TypeError("Invalid Heap application ID: " + appId);
    return null;
  }
  if (appId.length === 0) {
    this.error = RangeError("Empty Heap application ID");
    return null;
  }
  return appId;
};

/**
 * Checks if the argument is not a valid Heap server-side API identity.
 *
 * @private
 * @param {string|number} identity the identity to be checked
 * @returns {?string} the normalized identity, which will be passed to the Heap
 *   API; null if the identity is not valid
 */
Validator.prototype.normalizeIdentity = function(identity) {
  if (typeof(identity) === "number")
    identity = identity.toString();
  if (typeof(identity) !== "string") {
    this.error = TypeError("Invalid identity: " + identity);
    return null;
  }
  if (identity.length === 0) {
    this.error = RangeError("Empty identity");
    return null;
  }
  if (identity.length > 255) {
    this.error = RangeError("Identity " + identity + " too long; " +
        identity.length + " is above the 255-character limit");
    return null;
  }

  return identity;
};

/**
 * Checks if the argument is not a valid Heap server-side API event name.
 *
 * @private
 * @param {string} eventName the server-side event name to be checked
 * @returns {?string} the normalized event name, which will be passed to the
 *   Heap API; null if the event name is not valid
 */
Validator.prototype.normalizeEventName = function(eventName) {
  if (typeof(eventName) !== "string") {
    this.error = TypeError("Invalid event name: " + eventName);
    return null;
  }
  if (eventName.length === 0) {
    this.error = RangeError("Empty event name");
    return null;
  }
  if (eventName.length > 1024) {
    this.error = RangeError("Event name " + eventName + " too long; " +
        eventName.length + " is above the 1024-character limit");
    return null;
  }

  return eventName;
};

/**
 * Checks if the argument is not a valid key-value dictionary for the Heap API.
 *
 * @private
 * @param {Object<string,string|number>} properties the key-value dictionary
 *   to be checked
 * @returns {?Object<string,string|number>} the normalized key-value
 *   dictionary, which will be passed to the Heap API; null if the key-value
 *   dictionary is not valid
 */
Validator.prototype.normalizeProperties = function(properties) {
  if (typeof(properties) !== "object" || properties === null) {
    this.error = TypeError("Invalid properties: " + properties);
    return null;
  }

  for (var name in properties) {
    if (name.length > 1024) {
      this.error = RangeError("Property name " + name + " too long; " +
          name.length + " is above the 1024-character limit");
      return null;
    }
    var value = properties[name];

    if (typeof(value) === "string") {
      if (value.length > 1024) {
        this.error = RangeError("Property " + name + " value " + value +
            " too long; " + value.length +
            " is above the 1024-character limit");
        return null;
      }
    } else if (typeof(value) !== "number") {
      this.error = TypeError("Unsupported type for property " + name +
          " value: " + value);
      return null;
    }

  }
  return properties;
};

/**
 * The last error encountered while checking Heap API arguments.
 *
 * This attribute should be null between API calls. It is set to non-null
 * values by the normalize methods on Validator. It is checked and reset by
 * {@link heap-api.Client#_request}.
 *
 * @member {?Error}
 */
Validator.prototype.error = null;
