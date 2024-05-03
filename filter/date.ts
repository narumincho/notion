import type { ExistencePropertyFilter } from "./existence.ts";

/**
 * https://developers.notion.com/reference/post-database-query-filter#date
 */
export type DatePropertyFilter =
  | { readonly equals: string }
  | { readonly before: string }
  | { readonly after: string }
  | { readonly on_or_before: string }
  | { readonly on_or_after: string }
  | { readonly this_week: Record<string, never> }
  | { readonly past_week: Record<string, never> }
  | { readonly past_month: Record<string, never> }
  | { readonly past_year: Record<string, never> }
  | { readonly next_week: Record<string, never> }
  | { readonly next_month: Record<string, never> }
  | { readonly next_year: Record<string, never> }
  | ExistencePropertyFilter;

export const equals = (date: Date): DatePropertyFilter => ({
  equals: date.toISOString(),
});

export const before = (date: Date): DatePropertyFilter => ({
  before: date.toISOString(),
});

export const after = (date: Date): DatePropertyFilter => ({
  after: date.toISOString(),
});

export const onOrBefore = (date: Date): DatePropertyFilter => ({
  on_or_before: date.toISOString(),
});

export const onOrAfter = (date: Date): DatePropertyFilter => ({
  on_or_after: date.toISOString(),
});

export const thisWeek: DatePropertyFilter = { this_week: {} };

export const pastWeek: DatePropertyFilter = { past_week: {} };

export const pastMonth: DatePropertyFilter = { past_month: {} };

export const pastYear: DatePropertyFilter = { past_year: {} };

export const nextWeek: DatePropertyFilter = { next_week: {} };

export const nextMonth: DatePropertyFilter = { next_month: {} };

export const nextYear: DatePropertyFilter = { next_year: {} };

export * from "./existence.ts";
