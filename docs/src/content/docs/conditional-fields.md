---
title: Conditional Fields
description: Use when, unless, and mergeWhen for conditional serialization.
---

ResourcesJS includes Laravel-inspired helpers for removing fields cleanly.

## `when()`

`when()` includes a value only when the condition is truthy.

```ts
class UserResource extends Resource<User> {
  toArray() {
    return {
      id: this.resource.id,
      email: this.when(currentUser.isAdmin, this.resource.email),
    };
  }
}
```

When the condition fails, `email` is removed from the final output.

## Lazy Values

Pass a function to avoid computing expensive values unless the condition passes.

```ts
permissions: this.when(isAdmin, () => loadPermissions(this.resource))
```

## `unless()`

`unless()` is the inverse of `when()`.

```ts
email: this.unless(currentUser.isGuest, this.resource.email)
```

## `mergeWhen()`

Use `mergeWhen()` with object spread to include multiple fields at once.

```ts
return {
  id: this.resource.id,
  ...this.mergeWhen(currentUser.isAdmin, {
    email: this.resource.email,
    permissions: this.resource.permissions,
  }),
};
```

## Type Inference

Conditional fields are represented as optional properties in
`InferResource`.

```ts
type UserResponse = InferResource<typeof UserResource>;
// { id: number; email?: string }
```

Missing values are removed recursively from nested objects and arrays.
