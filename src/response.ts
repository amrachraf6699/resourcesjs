import { isBrandedEnvelope } from "./internal.js";
import type {
  PaginationMeta,
  ResourceMeta,
  SerializedCollectionEnvelope,
  SerializedPaginatedEnvelope,
  SerializedResourceEnvelope,
} from "./types.js";

export interface OkResponse<TData, TMeta extends ResourceMeta = ResourceMeta> {
  success: true;
  data: TData;
  meta?: TMeta;
}

function ok<TData>(
  value: SerializedPaginatedEnvelope<TData>,
): OkResponse<TData[], PaginationMeta>;
function ok<TData>(
  value: SerializedCollectionEnvelope<TData>,
): OkResponse<TData[]>;
function ok<TData, TMeta extends ResourceMeta>(
  value: SerializedResourceEnvelope<TData, TMeta>,
): OkResponse<TData, TMeta>;
function ok<TData>(value: TData): OkResponse<TData>;
function ok(value: unknown): OkResponse<unknown> {
  if (isBrandedEnvelope(value)) {
    return "meta" in value
      ? { success: true, data: value.data, meta: value.meta }
      : { success: true, data: value.data };
  }

  return { success: true, data: value };
}

export const response = Object.freeze({ ok });
