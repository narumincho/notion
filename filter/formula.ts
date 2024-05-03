import type { CheckboxPropertyFilter } from "./checkbox.ts";
import type { DatePropertyFilter } from "./date.ts";
import type { NumberPropertyFilter } from "./number.ts";
import type { TextPropertyFilter } from "./richText.ts";

/**
 * https://developers.notion.com/reference/page-property-values#formula
 */
export type FormulaPropertyFilter =
  | { readonly string: TextPropertyFilter }
  | { readonly checkbox: CheckboxPropertyFilter }
  | { readonly number: NumberPropertyFilter }
  | { readonly date: DatePropertyFilter };

export const string = (filter: TextPropertyFilter): FormulaPropertyFilter => ({
  string: filter,
});

export const checkbox = (
  filter: CheckboxPropertyFilter,
): FormulaPropertyFilter => ({
  checkbox: filter,
});

export const number = (
  filter: NumberPropertyFilter,
): FormulaPropertyFilter => ({
  number: filter,
});

export const date = (filter: DatePropertyFilter): FormulaPropertyFilter => ({
  date: filter,
});
