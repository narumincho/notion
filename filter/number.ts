import type { ExistencePropertyFilter } from "./existence.ts";

/**
 * https://developers.notion.com/reference/post-database-query-filter#number
 */
export type NumberPropertyFilter =
  | { readonly equals: number }
  | { readonly does_not_equal: number }
  | { readonly greater_than: number }
  | { readonly less_than: number }
  | { readonly greater_than_or_equal_to: number }
  | { readonly less_than_or_equal_to: number }
  | ExistencePropertyFilter;

export const equals = (number: number): NumberPropertyFilter => ({
  equals: number,
});

export const doesNotEqual = (number: number): NumberPropertyFilter => ({
  does_not_equal: number,
});

export const greaterThan = (number: number): NumberPropertyFilter => ({
  greater_than: number,
});

export const lessThan = (number: number): NumberPropertyFilter => ({
  less_than: number,
});

export const greaterThanOrEqualTo = (number: number): NumberPropertyFilter => ({
  greater_than_or_equal_to: number,
});

export const lessThanOrEqualTo = (number: number): NumberPropertyFilter => ({
  less_than_or_equal_to: number,
});

export * from "./existence.ts";
