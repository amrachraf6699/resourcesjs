import type { z } from "zod";
import type { Missing } from "./internal.js";

export type ResourceObject = Record<string, unknown>;
export type ResourceMeta = object;

export interface ResourceEnvelope<TData, TMeta extends ResourceMeta = ResourceMeta> {
  data: TData;
  meta?: TMeta;
}

declare const SERIALIZED_RESOURCE: unique symbol;

export type SerializedResourceEnvelope<
  TData,
  TMeta extends ResourceMeta = ResourceMeta,
> = ResourceEnvelope<TData, TMeta> & {
  readonly [SERIALIZED_RESOURCE]: true;
};

export interface CollectionEnvelope<TData> {
  data: TData[];
}

export type SerializedCollectionEnvelope<TData> = CollectionEnvelope<TData> & {
  readonly [SERIALIZED_RESOURCE]: true;
};

export interface PaginationInput<TData> {
  data: readonly TData[];
  page: number;
  perPage: number;
  total: number;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
}

export interface PaginatedEnvelope<TData> {
  data: TData[];
  meta: PaginationMeta;
}

export type SerializedPaginatedEnvelope<TData> = PaginatedEnvelope<TData> & {
  readonly [SERIALIZED_RESOURCE]: true;
};

export type ResourceClass<
  TResource = any,
  TInstance extends ResourceInstance<TResource> = ResourceInstance<TResource>,
> = {
  new (resource: TResource): TInstance;
  readonly schema?: z.ZodType;
  readonly name: string;
};

export interface ResourceInstance<TResource = unknown> {
  toArray(): unknown;
  meta(): ResourceMeta | undefined;
}

export type ResourceInput<TClass extends ResourceClass> =
  ConstructorParameters<TClass>[0];

type SchemaOutput<TClass> = TClass extends {
  readonly schema: infer TSchema extends z.ZodType;
}
  ? z.output<TSchema>
  : never;

type ArrayOutput<TClass extends ResourceClass> = ReturnType<
  InstanceType<TClass>["toArray"]
>;

type ConditionalKeys<TValue extends ResourceObject> = {
  [TKey in keyof TValue]-?: Extract<TValue[TKey], Missing> extends never
    ? never
    : TKey;
}[keyof TValue];

type RequiredKeys<TValue extends ResourceObject> = Exclude<
  keyof TValue,
  ConditionalKeys<TValue>
>;

type Simplify<TValue> = { [TKey in keyof TValue]: TValue[TKey] };

export type ResolveResourceOutput<TValue> = TValue extends Missing
  ? never
  : TValue extends SerializedResourceEnvelope<infer TData>
    ? ResolveResourceOutput<TData>
    : TValue extends SerializedCollectionEnvelope<infer TData>
      ? ResolveResourceOutput<TData>[]
      : TValue extends readonly (infer TItem)[]
        ? ResolveResourceOutput<TItem>[]
        : TValue extends Date | RegExp | Map<unknown, unknown> | Set<unknown>
          ? TValue
          : TValue extends ResourceObject
            ? Simplify<
                {
                  [TKey in RequiredKeys<TValue>]: ResolveResourceOutput<
                    TValue[TKey]
                  >;
                } & {
                  [TKey in ConditionalKeys<TValue>]?: ResolveResourceOutput<
                    Exclude<TValue[TKey], Missing>
                  >;
                }
              >
            : TValue;

export type InferResource<TClass extends ResourceClass> = TClass extends {
  readonly schema: z.ZodType;
}
  ? SchemaOutput<TClass>
  : ResolveResourceOutput<ArrayOutput<TClass>>;
