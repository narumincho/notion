import type { ExistencePropertyFilter } from "./existence.ts";

/**
 * https://developers.notion.com/reference/page-property-values#people
 */
export type PeoplePropertyFilter =
  | { readonly contains: string }
  | { readonly does_not_contain: string }
  | ExistencePropertyFilter;

export const contains = (userId: string): PeoplePropertyFilter => ({
  contains: userId,
});

export const doesNotContain = (userId: string): PeoplePropertyFilter => ({
  does_not_contain: userId,
});

export * from "./existence.ts";
