---
title: API Reference
description: Public ResourcesJS API, types, and helpers.
---

## `Resource<TResource, TOutput>`

Base class for synchronous Resource serializers.

```ts
abstract class Resource<TResource, TOutput extends ResourceObject> {
  constructor(resource: TResource);
  abstract toArray(): TOutput;
  meta(): ResourceMeta | undefined;
}
```

### Static Methods

| API | Description |
| --- | --- |
| `make(resource)` | Serialize one resource as `{ data }`. |
| `make(null)` | Serialize a null resource as `{ data: null }`. |
| `collection(resources)` | Serialize an array as `{ data: [...] }`. |
| `paginated(input)` | Serialize an array with pagination metadata. |

### Instance Helpers

| API | Description |
| --- | --- |
| `when(condition, value)` | Include a value when `condition` is truthy. |
| `unless(condition, value)` | Include a value unless `condition` is truthy. |
| `mergeWhen(condition, object)` | Conditionally merge an object into output. |
| `meta()` | Add metadata to top-level `make()` responses. |

## `InferResource<TClass>`

Infers the resolved Resource output type.

- Uses static Zod schema output when `schema` exists.
- Otherwise resolves `toArray()` output.
- Conditional fields become optional.
- Nested Resource envelopes resolve to their inner `data`.

```ts
type UserResponse = InferResource<typeof UserResource>;
```

## `generateOpenAPI(ResourceClass)`

Returns an OpenAPI 3.0-compatible inner schema object from the Resource's static
Zod schema.

```ts
const schema = generateOpenAPI(UserResource);
```

## `ResourceValidationError`

Thrown when a Resource's static Zod schema rejects serialized output.

```ts
class ResourceValidationError extends Error {
  resourceName: string;
  itemIndex: number | undefined;
  cause: z.ZodError;
}
```

## `response.ok(value)`

Wraps a value in `{ success: true, data }`. Branded Resource envelopes are
flattened while preserving top-level metadata.

## Exported Types

- `ResourceEnvelope`
- `CollectionEnvelope`
- `PaginatedEnvelope`
- `PaginationInput`
- `PaginationMeta`
- `ResourceClass`
- `ResourceInput`
- `ResourceMeta`
- `ResourceObject`
- `SerializedResourceEnvelope`
- `SerializedCollectionEnvelope`
- `SerializedPaginatedEnvelope`
- `ResolveResourceOutput`
- `OkResponse`
- `OpenAPISchema`
