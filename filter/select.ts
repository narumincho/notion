import type { ExistencePropertyFilter } from "./existence.ts";

/**
 * https://developers.notion.com/reference/post-database-query-filter#select
 */
export type SelectPropertyFilter =
  | { readonly equals: string }
  | { readonly does_not_equal: string }
  | ExistencePropertyFilter;

export const equals = (select: string): SelectPropertyFilter => ({
  equals: select,
});

export const doesNotEqual = (select: string): SelectPropertyFilter => ({
  does_not_equal: select,
});

export * from "./existence.ts";
