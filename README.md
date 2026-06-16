# ResourcesJS

Laravel-inspired API Resources for Node.js and TypeScript.

ResourcesJS keeps response serialization out of controllers by turning it into
reusable, strongly typed Resource classes. It works with any framework that can
return or send a plain JavaScript object.

## Install

```bash
npm install @amrachraf6690/resourcesjs zod
```

ResourcesJS supports Node.js 18.18 and newer, ESM, and CommonJS.

## Create A Resource

```ts
import { Resource, type InferResource } from "@amrachraf6690/resourcesjs";

interface User {
  id: number;
  name: string;
  email: string;
}

class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email,
    };
  }
}

const result = UserResource.make(user);
type UserResponse = InferResource<typeof UserResource>;
```

`result` is a serializable object:

```json
{
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  }
}
```

Passing `null` to `make()` returns `{ "data": null }`.

## Collections And Pagination

```ts
const collection = UserResource.collection(users);

const page = UserResource.paginated({
  data: users,
  page: 1,
  perPage: 10,
  total: 100,
});
```

Paginated output:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 100
  }
}
```

## Nested Resources

Resource envelopes are automatically unwrapped when nested. Ordinary objects
that happen to contain a `data` property remain unchanged.

```ts
class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      profile: ProfileResource.make(this.resource.profile),
      posts: PostResource.collection(this.resource.posts),
    };
  }
}
```

## Conditional Fields

`when()` and `unless()` remove missing values recursively. Their values can be
functions for lazy evaluation. `mergeWhen()` conditionally spreads an object.

```ts
class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      email: this.when(isAdmin, () => this.resource.email),
      nickname: this.unless(isGuest, this.resource.nickname),
      ...this.mergeWhen(isAdmin, {
        permissions: this.resource.permissions,
      }),
    };
  }
}
```

Conditional properties become optional in `InferResource`.

## Metadata

Override `meta()` to add metadata to a single top-level resource:

```ts
class UserResource extends Resource<User> {
  toArray() {
    return { id: this.resource.id };
  }

  meta() {
    return { version: "1.0" };
  }
}
```

Nested and collection item metadata is intentionally discarded.

## Zod Validation

Declare a static Zod schema to validate and transform resolved Resource data.
The parsed Zod output becomes the final response and drives `InferResource`.

```ts
import { z } from "zod";
import {
  Resource,
  ResourceValidationError,
} from "@amrachraf6690/resourcesjs";

class UserResource extends Resource<User> {
  static schema = z.object({
    id: z.number(),
    name: z.string(),
  });

  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
    };
  }
}
```

Invalid output throws `ResourceValidationError`. The error exposes
`resourceName`, `itemIndex` for collection failures, and the original Zod error
as `cause`.

## OpenAPI Schema

```ts
import { generateOpenAPI } from "@amrachraf6690/resourcesjs";

const schema = generateOpenAPI(UserResource);
```

`generateOpenAPI()` returns an OpenAPI 3.0-compatible inner schema object from
the Resource's static Zod schema. It documents the schema input because Zod
transforms can change runtime output and cannot always be represented in
OpenAPI. A Resource without a schema throws a clear error.

## Standardized Success Response

```ts
import { response } from "@amrachraf6690/resourcesjs";

response.ok(UserResource.make(user));
```

Output:

```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```

Resource metadata is preserved. Ordinary values are wrapped under `data`.

## Framework Usage

ResourcesJS has no framework runtime dependency. Return or send the Resource
result using the framework's normal response API:

```ts
// Express
app.get("/user", (_request, response) => {
  response.json(UserResource.make(user));
});

// Fastify
app.get("/user", () => UserResource.make(user));

// Hono
app.get("/user", (context) => context.json(UserResource.make(user)));

// NestJS
@Get()
show() {
  return UserResource.make(user);
}

// Elysia
app.get("/user", () => UserResource.make(user));

// AdonisJS controller
show() {
  return UserResource.make(user);
}
```

The repository verifies compatibility with Express 5, Fastify 4, Hono 4,
NestJS 10, Elysia 1.4, and AdonisJS 6.2.x.

Elysia's current Node adapter expects a global Web Crypto implementation. On
Node 18, initialize `globalThis.crypto` from `node:crypto`. Node 20 and newer
provide it globally.

## API

- `Resource<T>`: base class for synchronous Resources.
- `Resource.make(value | null)`: serialize one value.
- `Resource.collection(values)`: serialize a collection.
- `Resource.paginated(input)`: serialize a paginated collection.
- `when()`, `unless()`, `mergeWhen()`: conditional serialization helpers.
- `InferResource<typeof ResourceClass>`: infer resolved or schema output.
- `generateOpenAPI(ResourceClass)`: generate an inner OpenAPI schema object.
- `response.ok(value)`: create a standardized successful response.

ResourcesJS recursively resolves arrays and plain objects without mutating the
source data. It preserves non-plain serializable values such as `Date` and
throws when it detects a cyclic plain object or array.

## Development

```bash
npm install
npm run check
```

## License

MIT
