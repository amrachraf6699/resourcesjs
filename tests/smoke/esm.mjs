import { Resource } from "../../dist/index.js";

class SmokeResource extends Resource {
  toArray() {
    return { id: this.resource.id };
  }
}

const result = SmokeResource.make({ id: 1 });
if (JSON.stringify(result) !== '{"data":{"id":1}}') {
  throw new Error("ESM smoke test failed");
}
