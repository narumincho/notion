import type { ExistencePropertyFilter } from "./existence.ts";

/**
 * https://developers.notion.com/reference/post-database-query-filter#multi-select
 */
export type MultiSelectPropertyFilter =
  | { readonly contains: string }
  | { readonly does_not_contain: string }
  | ExistencePropertyFilter;

export const contains = (select: string): MultiSelectPropertyFilter => ({
  contains: select,
});

export const doesNotContain = (select: string): MultiSelectPropertyFilter => ({
  does_not_contain: select,
});

export * from "./existence.ts";
