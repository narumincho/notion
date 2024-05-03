/**
 * https://developers.notion.com/reference/post-database-query-filter#checkbox
 */
export type CheckboxPropertyFilter = { readonly equals: boolean } | {
  readonly does_not_equal: boolean;
};

export const equals = (checkbox: boolean): CheckboxPropertyFilter => ({
  equals: checkbox,
});

export const doesNotEqual = (checkbox: boolean): CheckboxPropertyFilter => ({
  does_not_equal: checkbox,
});
