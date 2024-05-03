import type { ExistencePropertyFilter } from "./existence.ts";

/**
 * https://developers.notion.com/reference/page-property-values#status
 */
export type StatusPropertyFilter =
  | { readonly equals: string }
  | { readonly does_not_equal: string }
  | ExistencePropertyFilter;

export const equals = (status: string): StatusPropertyFilter => ({
  equals: status,
});

export const doesNotEqual = (status: string): StatusPropertyFilter => ({
  does_not_equal: status,
});

export * from "./existence.ts";
