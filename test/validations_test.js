var Validator = require("../lib/validations.js");

describe("heap/validations~Validator", function() {
  beforeEach(function() {
    this.validator = new Validator();
  });
  describe("#constructor", function() {
    it("initializes #error to null", function() {
      expect(this.validator).to.have.property("error", null);
    });
  });
  describe("#normalizeAppId", function() {
    it("rejects non-strings", function() {
      var values = [null, 0, 1, 42, true, false, undefined, [], {},
          function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(this.validator.normalizeAppId(value)).to.equal(null);
        expect(this.validator.error).to.be.an.instanceOf(TypeError);
        expect(this.validator.error.message).to.equal(
            "Invalid Heap application ID: " + value);
      }
    });

    it("rejects empty strings", function() {
      expect(this.validator.normalizeAppId("")).to.equal(null);
      expect(this.validator.error).to.be.an.instanceOf(RangeError);
      expect(this.validator.error.message).to.equal(
          "Empty Heap application ID");
    });

    it("returns the argument", function() {
      expect(this.validator.normalizeAppId("test-app-id")).to.
          equal("test-app-id");
      expect(this.validator.error).to.equal(null);
    });
  });

  describe("#normalizeIdentity", function() {
    it("rejects invalid types", function() {
      var values = [null, true, false, undefined, [], {}, function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(this.validator.normalizeIdentity(value)).to.equal(null);
        expect(this.validator.error).to.be.an.instanceOf(TypeError);
        expect(this.validator.error.message).to.equal(
            "Invalid identity: " + value);
      }
    });

    it("rejects empty strings", function() {
      expect(this.validator.normalizeIdentity("")).to.equal(null);
      expect(this.validator.error).to.be.an.instanceOf(RangeError);
      expect(this.validator.error.message).to.equal(
          "Empty identity");
    });

    it("rejects long strings", function() {
      longIdentity = new Array(257).join("A")
      expect(this.validator.normalizeIdentity(longIdentity)).to.equal(null);
      expect(this.validator.error).to.be.an.instanceOf(RangeError);
      expect(this.validator.error.message).to.equal("Identity " +
          longIdentity + " too long; 256 is " +
          "above the 255-character limit");
    });


    it("returns a string argument", function() {
      expect(this.validator.normalizeIdentity("test-identity")).to.equal(
          "test-identity");
      expect(this.validator.error).to.equal(null);
    });

    it("stringifies a number argument", function() {
      expect(this.validator.normalizeIdentity(42)).to.equal("42");
      expect(this.validator.error).to.equal(null);
    });
  });

  describe("#normalizeEventName", function() {
    it("rejects invalid types", function() {
      var values = [null, 0, 1, 42, true, false, undefined, [], {},
          function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(this.validator.normalizeEventName(value)).to.equal(null);
        expect(this.validator.error).to.be.an.instanceOf(TypeError);
        expect(this.validator.error.message).to.equal(
            "Invalid event name: " + value);
      }
    });

    it("rejects empty strings", function() {
      expect(this.validator.normalizeEventName("")).to.equal(null);
      expect(this.validator.error).to.be.an.instanceOf(RangeError);
      expect(this.validator.error.message).to.equal("Empty event name");
    });

    it("rejects long strings", function() {
      longEventName = new Array(1026).join("A")
      expect(this.validator.normalizeEventName(longEventName)).to.equal(null);
      expect(this.validator.error).to.be.an.instanceOf(RangeError);
      expect(this.validator.error.message).to.equal("Event name " +
          longEventName + " too long; 1025 is above the 1024-character limit");
    });

    it("returns the argument", function() {
      expect(this.validator.normalizeEventName("test-event")).to.equal(
          "test-event");
      expect(this.validator.error).to.equal(null);
    });
  });


  describe("#normalizeProperties", function() {
    it("rejects invalid types", function() {
      var values = [null, 0, 1, 42, true, false, undefined, [],
          function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(this.validator.normalizeProperties(value)).to.equal(null);
        expect(this.validator.error).to.be.an.instanceOf(TypeError);
        expect(this.validator.error.message).to.equal(
            "Invalid properties: " + value);
      }
    });

    it("rejects long keys", function() {
      properties = {};
      longKey = new Array(1026).join("A");
      properties[longKey] = "value";
      expect(this.validator.normalizeProperties(properties)).to.equal(null);
      expect(this.validator.error).to.be.an.instanceOf(RangeError);
      expect(this.validator.error.message).to.equal("Property name " +
          longKey + " too long;" +
          " 1025 is above the 1024-character limit");
    });

    it("rejects long string values", function() {
      longValue = new Array(1026).join("A");
      expect(this.validator.normalizeProperties({ key: longValue })).to.equal(
          null);
      expect(this.validator.error).to.be.an.instanceOf(RangeError);
      expect(this.validator.error.message).to.equal("Property key value " +
          longValue + " too long;" +
          " 1025 is above the 1024-character limit");
    });

    it("rejects invalid value types", function() {
      var values = [null, true, false, undefined, [], {}, function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(this.validator.normalizeProperties({ key: value })).to.equal(
            null);
        expect(this.validator.error).to.be.an.instanceOf(TypeError);
        expect(this.validator.error.message).to.equal(
            "Unsupported type for property key value: " + value);
      }
    });

    it("returns the argument", function() {
      properties = { key: "value", number: 42 };
      expect(this.validator.normalizeProperties(properties)).to.equal(
          properties);
      expect(this.validator.error).to.equal(null);
    });
  });
});
