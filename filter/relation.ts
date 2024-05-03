import type { ExistencePropertyFilter } from "./existence.ts";

/**
 * https://developers.notion.com/reference/page-property-values#relation
 */
export type RelationPropertyFilter =
  | { readonly contains: string }
  | { readonly does_not_contain: string }
  | ExistencePropertyFilter;

export const contains = (relationId: string): RelationPropertyFilter => ({
  contains: relationId,
});

export const doesNotContain = (relationId: string): RelationPropertyFilter => ({
  does_not_contain: relationId,
});

export * from "./existence.ts";
