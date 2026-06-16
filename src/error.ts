import type { z } from "zod";

export interface ResourceValidationErrorOptions {
  resourceName: string;
  itemIndex?: number;
  cause: z.ZodError;
}

export class ResourceValidationError extends Error {
  readonly resourceName: string;
  readonly itemIndex: number | undefined;
  declare readonly cause: z.ZodError;

  constructor({
    resourceName,
    itemIndex,
    cause,
  }: ResourceValidationErrorOptions) {
    const location =
      itemIndex === undefined ? resourceName : `${resourceName}[${itemIndex}]`;

    super(`Validation failed for ${location}`, { cause });
    this.name = "ResourceValidationError";
    this.resourceName = resourceName;
    this.itemIndex = itemIndex;
    this.cause = cause;
  }
}
