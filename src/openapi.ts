import { z } from "zod";
import type { ResourceClass } from "./types.js";

export type OpenAPISchema = z.core.JSONSchema.BaseSchema;

export function generateOpenAPI<TClass extends ResourceClass>(
  resourceClass: TClass,
): OpenAPISchema {
  if (resourceClass.schema === undefined) {
    throw new TypeError(
      `${resourceClass.name} must define a static Zod schema to generate OpenAPI`,
    );
  }

  return z.toJSONSchema(resourceClass.schema, {
    target: "openapi-3.0",
    io: "input",
    unrepresentable: "any",
  }) as OpenAPISchema;
}
