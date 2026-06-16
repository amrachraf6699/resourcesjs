---
title: Framework Usage
description: Use ResourcesJS with Express, Fastify, Hono, NestJS, Elysia, and AdonisJS.
---

ResourcesJS returns plain objects. Use your framework's normal response API.

## Express

```ts
app.get("/users/:id", async (_request, response) => {
  const user = await service.find();
  response.json(UserResource.make(user));
});
```

## Fastify

```ts
fastify.get("/users/:id", async () => {
  const user = await service.find();
  return UserResource.make(user);
});
```

## Hono

```ts
app.get("/users/:id", async (context) => {
  const user = await service.find();
  return context.json(UserResource.make(user));
});
```

## NestJS

```ts
@Controller("users")
export class UserController {
  @Get(":id")
  async show() {
    const user = await this.service.find();
    return UserResource.make(user);
  }
}
```

## Elysia

```ts
new Elysia().get("/users/:id", async () => {
  const user = await service.find();
  return UserResource.make(user);
});
```

Elysia's Node adapter expects a global Web Crypto implementation. Node 20 and
newer provide it globally. On Node 18, initialize it from `node:crypto` before
loading Elysia.

## AdonisJS

```ts
export default class UsersController {
  async show() {
    const user = await service.find();
    return UserResource.make(user);
  }
}
```

The package test suite verifies compatibility examples for Express 5, Fastify
4, Hono 4, NestJS 10, Elysia 1.4, and AdonisJS 6.2.x.
