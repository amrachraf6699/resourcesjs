import type { z } from "zod";
import { brandEnvelope, MISSING, type Missing } from "./internal.js";
import { parseWithSchema, resolveValue } from "./serializer.js";
import type {
  CollectionEnvelope,
  InferResource,
  PaginatedEnvelope,
  PaginationInput,
  ResourceClass,
  ResourceEnvelope,
  ResourceInput,
  ResourceMeta,
  ResourceObject,
  SerializedCollectionEnvelope,
  SerializedPaginatedEnvelope,
  SerializedResourceEnvelope,
} from "./types.js";

export abstract class Resource<
  TResource,
  TOutput extends ResourceObject = ResourceObject,
> {
  static readonly schema?: z.ZodType;

  constructor(protected readonly resource: TResource) {}

  abstract toArray(): TOutput;

  meta(): ResourceMeta | undefined {
    return undefined;
  }

  protected when<TValue>(
    condition: unknown,
    value: TValue | (() => TValue),
  ): TValue | Missing {
    return condition ? this.evaluate(value) : MISSING;
  }

  protected unless<TValue>(
    condition: unknown,
    value: TValue | (() => TValue),
  ): TValue | Missing {
    return condition ? MISSING : this.evaluate(value);
  }

  protected mergeWhen<TValue extends ResourceObject>(
    condition: unknown,
    value: TValue | (() => TValue),
  ): Partial<TValue> {
    return condition ? this.evaluate(value) : {};
  }

  static make<TClass extends ResourceClass>(
    this: TClass,
    resource: null,
  ): SerializedResourceEnvelope<null>;
  static make<TClass extends ResourceClass>(
    this: TClass,
    resource: ResourceInput<TClass>,
  ): SerializedResourceEnvelope<InferResource<TClass>>;
  static make<TClass extends ResourceClass>(
    this: TClass,
    resource: ResourceInput<TClass> | null,
  ): SerializedResourceEnvelope<InferResource<TClass> | null>;
  static make<TClass extends ResourceClass>(
    this: TClass,
    resource: ResourceInput<TClass> | null,
  ): SerializedResourceEnvelope<InferResource<TClass> | null> {
    if (resource === null) {
      return brandEnvelope({ data: null }) as unknown as SerializedResourceEnvelope<
        InferResource<TClass> | null
      >;
    }

    const instance = new this(resource);
    const data = parseWithSchema(
      this.schema,
      resolveValue(instance.toArray()),
      this.name,
    ) as InferResource<TClass>;
    const meta = resolveValue(instance.meta()) as ResourceMeta | undefined;
    const envelope =
      meta === undefined ? { data } : { data, meta };

    return brandEnvelope(envelope) as unknown as SerializedResourceEnvelope<
      InferResource<TClass>
    >;
  }

  static collection<TClass extends ResourceClass>(
    this: TClass,
    resources: readonly ResourceInput<TClass>[],
  ): SerializedCollectionEnvelope<InferResource<TClass>> {
    const data = resources.map((resource, itemIndex) => {
      const instance = new this(resource);
      const resolved = resolveValue(instance.toArray());
      return parseWithSchema(
        this.schema,
        resolved,
        this.name,
        itemIndex,
      ) as InferResource<TClass>;
    });

    return brandEnvelope({ data }) as unknown as SerializedCollectionEnvelope<
      InferResource<TClass>
    >;
  }

  static paginated<TClass extends ResourceClass>(
    this: TClass,
    input: PaginationInput<ResourceInput<TClass>>,
  ): SerializedPaginatedEnvelope<InferResource<TClass>> {
    const data = input.data.map((resource, itemIndex) => {
      const instance = new this(resource);
      const resolved = resolveValue(instance.toArray());
      return parseWithSchema(
        this.schema,
        resolved,
        this.name,
        itemIndex,
      ) as InferResource<TClass>;
    });

    return brandEnvelope({
      data,
      meta: {
        page: input.page,
        perPage: input.perPage,
        total: input.total,
      },
    }) as unknown as SerializedPaginatedEnvelope<InferResource<TClass>>;
  }

  private evaluate<TValue>(value: TValue | (() => TValue)): TValue {
    return typeof value === "function"
      ? (value as () => TValue)()
      : value;
  }
}
