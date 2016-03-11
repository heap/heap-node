var heap = require("..");

describe("heap.Client", function() {
  beforeEach(function() {
    this.client = heap("test-app-id");
  });

  describe("#appId", function() {
    it("gets the constructor argument value", function() {
      expect(this.client.appId).to.equal("test-app-id");
    });
  });

  describe("#stubbed", function() {
    it("is false by default", function() {
      expect(this.client.stubbed).to.equal(false);
    });
    it("gets the constructor option value", function() {
      var client = heap("test-app-id", { stubbed: true });

      expect(client.stubbed).to.equal(true);
      expect(client.appId).to.equal("test-app-id");
    });
  });

  describe("#userAgent", function() {
    it("is heap.user_agent by default", function() {
      expect(this.client.userAgent).to.equal(require("../lib/user_agent.js"));
    });

    it("gets the constructor option value", function() {
      var client = heap("test-app-id", { userAgent: "test-user-agent" });

      expect(client.userAgent).to.equal("test-user-agent");
      expect(client.appId).to.equal("test-app-id");
    });
  });

  describe("#constructor", function() {
    it("ignores non-own properties on options object", function() {
      var optionsPrototype = { protoProperty: true };
      var Options = function() { return this; };
      Options.prototype = optionsPrototype;
      options = new Options();

      options.userAgent = "test-user-agent";
      var client = heap("test-app-id", options);
      expect(client).not.to.have.property("protoProperty");
      expect(client.userAgent).to.equal("test-user-agent");
      expect(client.appId).to.equal("test-app-id");
    });
  });
});
