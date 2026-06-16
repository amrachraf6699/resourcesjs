const { Resource } = require("../../dist/index.cjs");

class SmokeResource extends Resource {
  toArray() {
    return { id: this.resource.id };
  }
}

const result = SmokeResource.make({ id: 1 });
if (JSON.stringify(result) !== '{"data":{"id":1}}') {
  throw new Error("CommonJS smoke test failed");
}
