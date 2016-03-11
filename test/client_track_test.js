var nock = require("nock");
var heap = require("..");

describe("heap.Client#track", function() {
  beforeEach(function() {
    this.client = heap("test-app-id");
  });

  it("errors out when the client has an invalid application ID", function() {
    this.client.appId = null;
    expect(this.client.track("test_track_with_invalid_app_id", "test-identity",
        { "key": "value" })).to.be.rejectedWith(TypeError,
        /^Invalid Heap application ID: null$/);
  });

  it("errors out when the event name is invalid", function() {
    expect(this.client.track(null, "test-identity", { "key": "value" })).to.be.
        rejectedWith(Error, /^Invalid event name: null$/);
  });

  it("errors out when the identity is invalid", function() {
    expect(this.client.track("test_track_with_invalid_identity", null,
          { "key": "value" })).to.be.rejectedWith(TypeError,
          /^Invalid identity: null$/);
  });

  it("errors out when the properties dictionary is invalid", function() {
    expect(this.client.track("test_track_with_invalid_properties",
        "test-identity", true)).to.be.rejectedWith(Error,
        /^Invalid properties: true$/);
  });

  describe("with a mock backend", function() {
    beforeEach(function() {
      this.nock = nock("https://heapanalytics.com");
      nock.disableNetConnect();
    });
    afterEach(function() {
      var nockIsDone = nock.isDone();
      if (!nockIsDone)
        console.error("Pending HTTP requests: %j", nock.pendingMocks());
      nock.enableNetConnect();
      nock.cleanAll();
      if (!nockIsDone)
        throw Error("Test failed to issue all expected HTTP requests");
    });

    it("works with string identities", function() {
      this.nock.post("/api/track").reply(204, function(uri, requestBody) {
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", event: "test_track_with_string_identity",
          identity: "test-identity", properties: { foo: "bar" },
        });
      });

      return expect(this.client.track("test_track_with_string_identity",
          "test-identity", { foo: "bar" })).to.become(true);
    });

    it("works with integer identities", function() {
      this.nock.post("/api/track").reply(204, function(uri, requestBody) {
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", event: "test_track_with_integer_identity",
          identity: "123456789", properties: { foo: "bar" },
        });
      });

      return expect(this.client.track("test_track_with_integer_identity",
          123456789, { foo: "bar" })).to.become(true);
    });

    it("works with null properties", function() {
      this.nock.post("/api/track").reply(204, function(uri, requestBody) {
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", event: "test_track_with_null_properties",
          identity: "test-identity",
        });
      });

      return expect(this.client.track("test_track_with_null_properties",
          "test-identity", null)).to.become(true);
    });

    it("works without properties", function() {
      this.nock.post("/api/track").reply(204, function(uri, requestBody) {
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", event: "test_track_without_properties",
          identity: "test-identity",
        });
      });

      return expect(this.client.track("test_track_without_properties",
          "test-identity")).to.become(true);
    });

    it("works with a callback without properties", function(done) {
      this.nock.post("/api/track").reply(204, function(uri, requestBody) {
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", event: "test_track_with_callback",
          identity: "test-identity",
        });
      });

      this.client.track("test_track_with_callback", "test-identity",
          function(error) {
        expect(error).to.be.undefined;
        done();
      });
    });
  });

  describe("with a stubbed client", function() {
    beforeEach(function() {
      this.client.stubbed = true;
    });

    it("succeeds", function() {
      return expect(this.client.track("test_track_with_stubbed_client",
          "test-identity", { foo: "bar" })).to.become(true);
    });
  });

  describe("when talking to the real backend", function() {
    beforeEach(function() {
      this.client.appId = "3000610572";
    });

    it("succeeds", function() {
      return expect(this.client.track("test_track_integration",
          "test-identity", { language: "node", project: "heap/heap-node" })).
          to.become(true);
    });
  });
});
