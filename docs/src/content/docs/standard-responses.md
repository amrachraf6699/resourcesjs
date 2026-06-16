---
title: Standard Responses
description: Wrap Resource output in a success envelope.
---

ResourcesJS exports one optional response helper: `response.ok()`.

```ts
import { response } from "@amrachraf6690/resourcesjs";

return response.ok(UserResource.make(user));
```

Output:

```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```

## Metadata

Resource metadata is preserved:

```json
{
  "success": true,
  "data": {
    "id": 1
  },
  "meta": {
    "version": "1.0"
  }
}
```

## Ordinary Values

Only branded Resource envelopes are flattened. Ordinary values are wrapped under
`data`, even if they already contain a `data` property.

```ts
response.ok({ data: "ordinary" });
```

```json
{
  "success": true,
  "data": {
    "data": "ordinary"
  }
}
```
