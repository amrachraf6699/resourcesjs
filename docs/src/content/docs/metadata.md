---
title: Metadata
description: Attach top-level metadata to Resource responses.
---

Override `meta()` to add metadata to a single top-level Resource response.

```ts
class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
    };
  }

  meta() {
    return {
      version: "1.0",
    };
  }
}
```

Output:

```json
{
  "data": {
    "id": 1,
    "name": "John"
  },
  "meta": {
    "version": "1.0"
  }
}
```

## Scope

Metadata applies to top-level `make()` responses only.

- Collection items do not include per-item metadata.
- Nested Resource metadata is discarded.
- Pagination uses its documented pagination metadata.

This keeps response envelopes stable and easy to consume.
