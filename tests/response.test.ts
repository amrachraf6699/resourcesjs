import { describe, expect, it } from "vitest";
import { Resource, response } from "../src/index.js";

class ItemResource extends Resource<{ id: number }> {
  toArray() {
    return { id: this.resource.id };
  }

  meta() {
    return { version: "1.0" };
  }
}

describe("response.ok", () => {
  it("flattens branded resource envelopes and preserves metadata", () => {
    expect(response.ok(ItemResource.make({ id: 1 }))).toEqual({
      success: true,
      data: { id: 1 },
      meta: { version: "1.0" },
    });
  });

  it("flattens branded collections and pagination", () => {
    expect(response.ok(ItemResource.collection([{ id: 1 }]))).toEqual({
      success: true,
      data: [{ id: 1 }],
    });
    expect(
      response.ok(
        ItemResource.paginated({
          data: [{ id: 1 }],
          page: 1,
          perPage: 10,
          total: 1,
        }),
      ),
    ).toEqual({
      success: true,
      data: [{ id: 1 }],
      meta: { page: 1, perPage: 10, total: 1 },
    });
  });

  it("wraps ordinary values, including ordinary data-shaped objects", () => {
    expect(response.ok("done")).toEqual({ success: true, data: "done" });
    expect(response.ok({ data: "ordinary" })).toEqual({
      success: true,
      data: { data: "ordinary" },
    });
  });
});
