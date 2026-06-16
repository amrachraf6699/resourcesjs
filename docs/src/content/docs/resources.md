---
title: Resources
description: Define reusable Resource classes for single API objects.
---

A Resource class wraps one input object and returns the public API shape from
`toArray()`.

```ts
import { Resource } from "@amrachraf6690/resourcesjs";

class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email,
    };
  }
}
```

## `make()`

Use `make()` to serialize one resource:

```ts
const payload = UserResource.make(user);
```

Output:

```json
{
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  }
}
```

## Null Resources

Passing `null` is explicit and serializes to `data: null`.

```ts
UserResource.make(null);
```

```json
{
  "data": null
}
```

## Serialization Rules

- `toArray()` should be synchronous.
- Source data is not mutated.
- Plain objects and arrays are recursively resolved.
- Nested Resource envelopes are unwrapped to their inner `data`.
- Non-plain serializable values such as `Date` are preserved.
- Cyclic objects and arrays throw a `TypeError`.
