---
title: Collections
description: Serialize arrays of Resources.
---

Use `collection()` to serialize many resources with the same Resource class.

```ts
const payload = UserResource.collection(users);
```

Output:

```json
{
  "data": [
    {
      "id": 1,
      "name": "John"
    },
    {
      "id": 2,
      "name": "Jane"
    }
  ]
}
```

Collection items are validated with the static schema when one exists. If a
validation error occurs, the thrown `ResourceValidationError` includes the
failing `itemIndex`.

```ts
try {
  UserResource.collection(users);
} catch (error) {
  if (error instanceof ResourceValidationError) {
    console.log(error.resourceName);
    console.log(error.itemIndex);
  }
}
```

## Nested Collections

Collections can be nested inside another Resource. The outer Resource receives
the collection's `data` array, not another envelope.

```ts
class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      posts: PostResource.collection(this.resource.posts),
    };
  }
}
```
