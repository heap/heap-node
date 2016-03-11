var heap = require("..");

describe("heap.ApiError", function() {
  beforeEach(function() {
    this.client = heap("test-app-id");
    this.response = { statusCode: 400, body: "Bad method" };
    this.error = new heap.ApiError(this.response, this.client);
  });

  describe("#constructor", function() {
    it("sets the attributes correctly", function() {
      expect(this.error.response).to.equal(this.response);
      expect(this.error.client).to.equal(this.client);
      expect(this.error.name).to.equal("heap.ApiError");
      expect(this.error.message).to.equal(
          "Heap API server error 400: Bad method");
    });

    it("sets the prototype correctly", function() {
      expect(this.error).to.be.an.instanceOf(heap.ApiError);
      expect(this.error).to.be.an.instanceOf(Error);
    });

    it("sets the stack trace correctly", function() {
      expect(this.error.stack).to.match(
          /Heap API server error 400: Bad method\n/);
      expect(this.error.stack).to.match(/test\/api_error_test\.js:/);
    });

    it("works without a request and a client", function() {
      client = new heap.ApiError();
      expect(client).to.be.an.instanceOf(heap.ApiError);
      expect(client).to.be.an.instanceOf(Error);
      expect(client.message).to.equal("Unknown Heap API server error");
    });
  });
});
