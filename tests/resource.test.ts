import { describe, expect, it, vi } from "vitest";
import { Resource } from "../src/index.js";

interface Profile {
  bio: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  profile: Profile;
  friends: Profile[];
}

class ProfileResource extends Resource<Profile> {
  toArray() {
    return {
      bio: this.resource.bio,
    };
  }
}

class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      profile: ProfileResource.make(this.resource.profile),
      friends: ProfileResource.collection(this.resource.friends),
    };
  }

  meta() {
    return { version: "1.0" };
  }
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
  profile: { bio: "Author" },
  friends: [{ bio: "Editor" }],
};

describe("Resource", () => {
  it("serializes a resource, nested resource, nested collection, and metadata", () => {
    const result = UserResource.make(user);

    expect(result).toEqual({
      data: {
        id: 1,
        name: "John",
        profile: { bio: "Author" },
        friends: [{ bio: "Editor" }],
      },
      meta: { version: "1.0" },
    });
    expect(Object.keys(result)).toEqual(["data", "meta"]);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it("returns null data for a null resource", () => {
    expect(UserResource.make(null)).toEqual({ data: null });
  });

  it("serializes collections without item metadata", () => {
    expect(UserResource.collection([user])).toEqual({
      data: [
        {
          id: 1,
          name: "John",
          profile: { bio: "Author" },
          friends: [{ bio: "Editor" }],
        },
      ],
    });
  });

  it("serializes paginated collections with pagination metadata", () => {
    expect(
      UserResource.paginated({
        data: [user],
        page: 2,
        perPage: 10,
        total: 21,
      }),
    ).toEqual({
      data: [
        {
          id: 1,
          name: "John",
          profile: { bio: "Author" },
          friends: [{ bio: "Editor" }],
        },
      ],
      meta: { page: 2, perPage: 10, total: 21 },
    });
  });

  it("removes conditional fields recursively and lazily evaluates values", () => {
    const evaluate = vi.fn(() => "secret");

    class ConditionalResource extends Resource<User> {
      toArray() {
        return {
          id: this.resource.id,
          email: this.when(false, evaluate),
          visibleEmail: this.unless(false, this.resource.email),
          nested: {
            hidden: this.when(false, "hidden"),
            shown: true,
          },
          values: [1, this.when(false, 2), 3],
          ...this.mergeWhen(true, { role: "admin" }),
          ...this.mergeWhen(false, { ignored: true }),
        };
      }
    }

    expect(ConditionalResource.make(user)).toEqual({
      data: {
        id: 1,
        visibleEmail: "john@example.com",
        nested: { shown: true },
        values: [1, 3],
        role: "admin",
      },
    });
    expect(evaluate).not.toHaveBeenCalled();
  });

  it("preserves ordinary data properties, non-plain values, and source data", () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const source = { nested: { data: "ordinary" }, createdAt };

    class PlainResource extends Resource<typeof source> {
      toArray() {
        return this.resource;
      }
    }

    const result = PlainResource.make(source);
    expect(result.data).toEqual(source);
    expect(result.data.nested).toEqual({ data: "ordinary" });
    expect(result.data.createdAt).toBe(createdAt);
    expect(source).toEqual({ nested: { data: "ordinary" }, createdAt });
  });

  it("rejects cyclic plain objects and arrays", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;

    class CyclicResource extends Resource<typeof cyclic> {
      toArray() {
        return this.resource;
      }
    }

    expect(() => CyclicResource.make(cyclic)).toThrow(
      "ResourcesJS cannot serialize a cyclic structure",
    );
  });

  it("rejects cyclic custom serializable objects while preserving instances", () => {
    class Serializable {
      self?: Serializable;
    }

    const cyclic = new Serializable();
    cyclic.self = cyclic;

    class CustomResource extends Resource<{ value: Serializable }> {
      toArray() {
        return { value: this.resource.value };
      }
    }

    expect(() => CustomResource.make({ value: cyclic })).toThrow(
      "ResourcesJS cannot serialize a cyclic structure",
    );
  });
});
