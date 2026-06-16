---
title: Nested Resources
description: Compose Resources inside other Resources.
---

Nested Resources let each model own its own API shape.

```ts
class ProfileResource extends Resource<Profile> {
  toArray() {
    return {
      bio: this.resource.bio,
      avatarUrl: this.resource.avatarUrl,
    };
  }
}

class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      profile: ProfileResource.make(this.resource.profile),
    };
  }
}
```

Output:

```json
{
  "data": {
    "id": 1,
    "name": "John",
    "profile": {
      "bio": "Builder",
      "avatarUrl": "https://example.com/avatar.png"
    }
  }
}
```

## Metadata Is Top-Level Only

When a nested Resource has `meta()`, that metadata is intentionally discarded.
Only the top-level `make()` result includes Resource metadata.

This keeps nested output predictable and avoids accidentally leaking metadata
into embedded relationships.
