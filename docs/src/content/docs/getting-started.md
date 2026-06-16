---
title: Getting Started
description: Install ResourcesJS and create your first Resource class.
---

ResourcesJS is a small TypeScript library for serializing API responses. It has
one runtime dependency: Zod.

## Requirements

- Node.js `>=18.18.0` for the package.
- TypeScript for the best developer experience.
- Zod 4 when using validation or OpenAPI generation.

## Installation

```bash
npm install @amrachraf6690/resourcesjs zod
```

## Create a Resource

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

const payload = UserResource.make({
  id: 1,
  name: "John",
  email: "john@example.com",
});

type UserResponse = InferResource<typeof UserResource>;
```

`payload` is a plain serializable object:

```json
{
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  }
}
```

## Return It From Any Framework

```ts
app.get("/users/:id", async (_request, response) => {
  const user = await users.findById(1);
  response.json(UserResource.make(user));
});
```

ResourcesJS does not require middleware, decorators, ORM models, or framework
plugins. If your framework can send a JavaScript object, it can send a Resource.
