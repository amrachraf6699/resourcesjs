import type { ResourceEnvelope } from "./types.js";

declare const MISSING_TYPE: unique symbol;
export interface Missing {
  readonly [MISSING_TYPE]: true;
}

export const MISSING = Symbol("ResourcesJS.Missing") as unknown as Missing;

const ENVELOPE = Symbol("ResourcesJS.Envelope");

export type BrandedEnvelope<TData = unknown> = ResourceEnvelope<TData> & {
  readonly [ENVELOPE]: true;
};

export function brandEnvelope<TData, TEnvelope extends ResourceEnvelope<TData>>(
  envelope: TEnvelope,
): TEnvelope & BrandedEnvelope<TData> {
  Object.defineProperty(envelope, ENVELOPE, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });

  return envelope as TEnvelope & BrandedEnvelope<TData>;
}

export function isBrandedEnvelope(value: unknown): value is BrandedEnvelope {
  return (
    typeof value === "object" &&
    value !== null &&
    ENVELOPE in value &&
    (value as BrandedEnvelope)[ENVELOPE] === true
  );
}
