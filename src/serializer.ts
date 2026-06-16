import type { z } from "zod";
import { ResourceValidationError } from "./error.js";
import { isBrandedEnvelope, MISSING } from "./internal.js";

interface SerializeOptions {
  seen?: WeakSet<object>;
}

function isPlainObject(value: object): value is Record<PropertyKey, unknown> {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertNoCycles(value: object, seen: WeakSet<object>): void {
  if (seen.has(value)) {
    throw new TypeError("ResourcesJS cannot serialize a cyclic structure");
  }

  seen.add(value);
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor?.enumerable) {
      continue;
    }

    const nested = (value as Record<PropertyKey, unknown>)[key];
    if (typeof nested === "object" && nested !== null) {
      assertNoCycles(nested, seen);
    }
  }
  seen.delete(value);
}

export function resolveValue(
  value: unknown,
  options: SerializeOptions = {},
): unknown {
  const seen = options.seen ?? new WeakSet<object>();

  if (value === MISSING) {
    return MISSING;
  }

  if (isBrandedEnvelope(value)) {
    return resolveValue(value.data, { seen });
  }

  if (Array.isArray(value)) {
    if (seen.has(value)) {
      throw new TypeError("ResourcesJS cannot serialize a cyclic structure");
    }

    seen.add(value);
    const result = value
      .map((item) => resolveValue(item, { seen }))
      .filter((item) => item !== MISSING);
    seen.delete(value);
    return result;
  }

  if (typeof value === "object" && value !== null && isPlainObject(value)) {
    if (seen.has(value)) {
      throw new TypeError("ResourcesJS cannot serialize a cyclic structure");
    }

    seen.add(value);
    const result: Record<PropertyKey, unknown> = {};

    for (const key of Reflect.ownKeys(value)) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor?.enumerable) {
        continue;
      }

      const resolved = resolveValue(value[key], { seen });
      if (resolved !== MISSING) {
        result[key] = resolved;
      }
    }

    seen.delete(value);
    return result;
  }

  if (typeof value === "object" && value !== null) {
    assertNoCycles(value, seen);
  }

  return value;
}

export function parseWithSchema(
  schema: z.ZodType | undefined,
  value: unknown,
  resourceName: string,
  itemIndex?: number,
): unknown {
  if (schema === undefined) {
    return value;
  }

  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new ResourceValidationError({
      resourceName,
      ...(itemIndex === undefined ? {} : { itemIndex }),
      cause: parsed.error,
    });
  }

  return parsed.data;
}
