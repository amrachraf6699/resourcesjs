import { z } from "zod";
import { describe, expect, it } from "vitest";
import {
  generateOpenAPI,
  Resource,
  ResourceValidationError,
} from "../src/index.js";

class ValidatedResource extends Resource<{ id: string; extra?: string }> {
  static schema = z.object({
    id: z.coerce.number().transform((id) => id * 2),
    name: z.string().default("Anonymous"),
  });

  toArray() {
    return {
      id: this.resource.id,
      extra: this.resource.extra,
    };
  }
}

describe("Zod validation", () => {
  it("uses parsed schema output for the response", () => {
    expect(ValidatedResource.make({ id: "4", extra: "removed" })).toEqual({
      data: { id: 8, name: "Anonymous" },
    });
  });

  it("wraps validation failures with resource context", () => {
    try {
      ValidatedResource.make({ id: "invalid" });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceValidationError);
      expect(error).toMatchObject({
        name: "ResourceValidationError",
        resourceName: "ValidatedResource",
        itemIndex: undefined,
      });
      expect((error as ResourceValidationError).cause).toBeInstanceOf(
        z.ZodError,
      );
    }
  });

  it("includes the collection index in validation failures", () => {
    expect(() =>
      ValidatedResource.collection([{ id: "1" }, { id: "invalid" }]),
    ).toThrowError(
      expect.objectContaining({
        resourceName: "ValidatedResource",
        itemIndex: 1,
      }),
    );
  });
});

describe("OpenAPI generation", () => {
  it("returns an OpenAPI schema object from a static Zod schema", () => {
    const schema = generateOpenAPI(ValidatedResource);

    expect(schema).toMatchObject({
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string", default: "Anonymous" },
      },
    });
  });

  it("requires a static schema", () => {
    class UnvalidatedResource extends Resource<{ id: number }> {
      toArray() {
        return { id: this.resource.id };
      }
    }

    expect(() => generateOpenAPI(UnvalidatedResource)).toThrow(
      "UnvalidatedResource must define a static Zod schema",
    );
  });
});
