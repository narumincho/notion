import type { ExistencePropertyFilter } from "./existence.ts";

/**
 * https://developers.notion.com/reference/post-database-query-filter#rich-text
 */
export type TextPropertyFilter =
  | { readonly equals: string }
  | { readonly does_not_equal: string }
  | { readonly contains: string }
  | { readonly does_not_contain: string }
  | { readonly starts_with: string }
  | { readonly ends_with: string }
  | ExistencePropertyFilter;

export const equals = (text: string): TextPropertyFilter => ({
  equals: text,
});

export const doesNotEqual = (text: string): TextPropertyFilter => ({
  does_not_equal: text,
});

export const contains = (text: string): TextPropertyFilter => ({
  contains: text,
});

export const doesNotContain = (text: string): TextPropertyFilter => ({
  does_not_contain: text,
});

export const startsWith = (text: string): TextPropertyFilter => ({
  starts_with: text,
});

export const endsWith = (text: string): TextPropertyFilter => ({
  ends_with: text,
});

export * from "./existence.ts";
