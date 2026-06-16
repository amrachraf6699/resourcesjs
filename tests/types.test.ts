import { z } from "zod";
import { describe, expectTypeOf, it } from "vitest";
import {
  Resource,
  response,
  type InferResource,
  type SerializedCollectionEnvelope,
  type SerializedPaginatedEnvelope,
  type SerializedResourceEnvelope,
} from "../src/index.js";

interface User {
  id: number;
  email: string;
}

class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      email: this.when(true, this.resource.email),
    };
  }
}

class SchemaResource extends Resource<User> {
  static schema = z.object({
    id: z.string(),
  });

  toArray() {
    return { id: String(this.resource.id) };
  }
}

describe("public types", () => {
  it("infers toArray output and conditional optional fields", () => {
    type Inferred = InferResource<typeof UserResource>;
    type Expected = {
      id: number;
      email?: string;
    };
    const inferred: Inferred = { id: 1 };
    const expected: Expected = inferred;
    const reverse: Inferred = expected;

    expectTypeOf(expected).toMatchTypeOf<Expected>();
    expectTypeOf(reverse).toMatchTypeOf<Inferred>();
  });

  it("uses schema output when a static schema exists", () => {
    expectTypeOf<InferResource<typeof SchemaResource>>().toEqualTypeOf<{
      id: string;
    }>();
  });

  it("types all serialization methods and response helpers", () => {
    expectTypeOf(UserResource.make({ id: 1, email: "a@example.com" })).toMatchTypeOf<
      SerializedResourceEnvelope<{
        id: number;
        email?: string;
      }>
    >();
    expectTypeOf(UserResource.make(null)).toEqualTypeOf<
      SerializedResourceEnvelope<null>
    >();
    expectTypeOf(UserResource.collection([])).toMatchTypeOf<
      SerializedCollectionEnvelope<{
        id: number;
        email?: string;
      }>
    >();
    expectTypeOf(
      UserResource.paginated({ data: [], page: 1, perPage: 10, total: 0 }),
    ).toMatchTypeOf<
      SerializedPaginatedEnvelope<{
        id: number;
        email?: string;
      }>
    >();
    expectTypeOf(response.ok(UserResource.make({ id: 1, email: "x" })).data)
      .toMatchTypeOf<{ id: number; email?: string }>();
    expectTypeOf(response.ok(UserResource.collection([])).data).toMatchTypeOf<
      Array<{ id: number; email?: string }>
    >();
    expectTypeOf(
      response.ok(
        UserResource.paginated({
          data: [],
          page: 1,
          perPage: 10,
          total: 0,
        }),
      ).data,
    ).toMatchTypeOf<Array<{ id: number; email?: string }>>();
    expectTypeOf(response.ok({ data: "ordinary" }).data).toEqualTypeOf<{
      data: string;
    }>();
  });
});
