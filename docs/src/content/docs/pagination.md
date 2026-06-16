---
title: Pagination
description: Serialize paginated Resource collections.
---

Use `paginated()` when returning a page of data plus pagination metadata.

```ts
const payload = UserResource.paginated({
  data: users,
  page: 1,
  perPage: 10,
  total: 100,
});
```

Output:

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

## Input Shape

```ts
interface PaginationInput<TData> {
  data: readonly TData[];
  page: number;
  perPage: number;
  total: number;
}
```

`paginated()` uses the same serialization and validation rules as
`collection()`.
