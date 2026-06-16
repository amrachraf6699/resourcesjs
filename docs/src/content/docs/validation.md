---
title: Validation With Zod
description: Validate and transform Resource output with static Zod schemas.
---

Declare a static Zod schema on a Resource to validate resolved output.

```ts
import { z } from "zod";
import { Resource } from "@amrachraf6690/resourcesjs";

class UserResource extends Resource<User> {
  static schema = z.object({
    id: z.number(),
    name: z.string(),
  });

  toArray() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      ignored: "removed by Zod",
    };
  }
}
```

The parsed Zod output becomes the final response. That means defaults,
coercion, transforms, and unknown-key stripping can affect the serialized data.

## Error Handling

Invalid output throws `ResourceValidationError`.

```ts
import { ResourceValidationError } from "@amrachraf6690/resourcesjs";

try {
  return UserResource.make(user);
} catch (error) {
  if (error instanceof ResourceValidationError) {
    console.error(error.resourceName);
    console.error(error.itemIndex);
    console.error(error.cause);
  }
}
```

Properties:

- `resourceName`: Resource class name.
- `itemIndex`: failing collection index when applicable.
- `cause`: original `z.ZodError`.

## Type Inference

When a static schema exists, `InferResource` uses the schema output type.

```ts
type UserResponse = InferResource<typeof UserResource>;
```
