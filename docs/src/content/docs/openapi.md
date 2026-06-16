---
title: OpenAPI Generation
description: Generate OpenAPI schema objects from Resource schemas.
---

`generateOpenAPI()` converts a Resource's static Zod schema into an OpenAPI
3.0-compatible inner schema object.

```ts
import { generateOpenAPI } from "@amrachraf6690/resourcesjs";

const schema = generateOpenAPI(UserResource);
```

Example output:

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "number"
    },
    "name": {
      "type": "string"
    }
  },
  "required": ["id", "name"],
  "additionalProperties": false
}
```

## Important Behavior

- The function returns an inner schema object, not a complete OpenAPI document.
- The Resource must define a static Zod schema.
- OpenAPI generation documents the schema input side because Zod transforms
  cannot always be represented in OpenAPI.

If the Resource has no schema, ResourcesJS throws:

```txt
UserResource must define a static Zod schema to generate OpenAPI
```
