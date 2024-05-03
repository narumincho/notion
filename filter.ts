import { ExistencePropertyFilter } from "./filter/existence.ts";
import { DatePropertyFilter } from "./filter/date.ts";

export type Filter =
  | {
    or: ReadonlyArray<
      | PropertyFilter
      | TimestampCreatedTimeFilter
      | TimestampLastEditedTimeFilter
      | { or: Array<PropertyFilter> }
      | { and: Array<PropertyFilter> }
    >;
  }
  | {
    and: ReadonlyArray<
      | PropertyFilter
      | TimestampCreatedTimeFilter
      | TimestampLastEditedTimeFilter
      | { or: Array<PropertyFilter> }
      | { and: Array<PropertyFilter> }
    >;
  }
  | PropertyFilter
  | TimestampCreatedTimeFilter
  | TimestampLastEditedTimeFilter;

export type TimestampCreatedTimeFilter = {
  created_time: DatePropertyFilter;
  timestamp: "created_time";
  type: "created_time";
};

export type TimestampLastEditedTimeFilter = {
  last_edited_time: DatePropertyFilter;
  timestamp: "last_edited_time";
  type: "last_edited_time";
};

export type TextPropertyFilter =
  | { equals: string }
  | { does_not_equal: string }
  | { contains: string }
  | { does_not_contain: string }
  | { starts_with: string }
  | { ends_with: string }
  | ExistencePropertyFilter;

export type NumberPropertyFilter =
  | { equals: number }
  | { does_not_equal: number }
  | { greater_than: number }
  | { less_than: number }
  | { greater_than_or_equal_to: number }
  | { less_than_or_equal_to: number }
  | ExistencePropertyFilter;

export type CheckboxPropertyFilter = { equals: boolean } | {
  does_not_equal: boolean;
};

export type SelectPropertyFilter =
  | { equals: string }
  | { does_not_equal: string }
  | ExistencePropertyFilter;

export type MultiSelectPropertyFilter =
  | { contains: string }
  | { does_not_contain: string }
  | ExistencePropertyFilter;

export type StatusPropertyFilter =
  | { equals: string }
  | { does_not_equal: string }
  | ExistencePropertyFilter;

export type PeoplePropertyFilter =
  | { contains: string }
  | { does_not_contain: string }
  | ExistencePropertyFilter;

export type RelationPropertyFilter =
  | { contains: string }
  | { does_not_contain: string }
  | ExistencePropertyFilter;

export type FormulaPropertyFilter =
  | { string: TextPropertyFilter }
  | { checkbox: CheckboxPropertyFilter }
  | { number: NumberPropertyFilter }
  | { date: DatePropertyFilter };

export type RollupSubfilterPropertyFilter =
  | { rich_text: TextPropertyFilter }
  | { number: NumberPropertyFilter }
  | { checkbox: CheckboxPropertyFilter }
  | { select: SelectPropertyFilter }
  | { multi_select: MultiSelectPropertyFilter }
  | { relation: RelationPropertyFilter }
  | { date: DatePropertyFilter }
  | { people: PeoplePropertyFilter }
  | { files: ExistencePropertyFilter }
  | { status: StatusPropertyFilter };

export type RollupPropertyFilter =
  | { any: RollupSubfilterPropertyFilter }
  | { none: RollupSubfilterPropertyFilter }
  | { every: RollupSubfilterPropertyFilter }
  | { date: DatePropertyFilter }
  | { number: NumberPropertyFilter };

export type PropertyFilter =
  | { title: TextPropertyFilter; property: string; type: "title" }
  | { rich_text: TextPropertyFilter; property: string; type: "rich_text" }
  | { number: NumberPropertyFilter; property: string; type: "number" }
  | { checkbox: CheckboxPropertyFilter; property: string; type: "checkbox" }
  | { select: SelectPropertyFilter; property: string; type: "select" }
  | {
    multi_select: MultiSelectPropertyFilter;
    property: string;
    type: "multi_select";
  }
  | { status: StatusPropertyFilter; property: string; type: "status" }
  | { date: DatePropertyFilter; property: string; type: "date" }
  | { people: PeoplePropertyFilter; property: string; type: "people" }
  | { files: ExistencePropertyFilter; property: string; type: "files" }
  | { url: TextPropertyFilter; property: string; type: "url" }
  | { email: TextPropertyFilter; property: string; type: "email" }
  | {
    phone_number: TextPropertyFilter;
    property: string;
    type: "phone_number";
  }
  | { relation: RelationPropertyFilter; property: string; type: "relation" }
  | { created_by: PeoplePropertyFilter; property: string; type: "created_by" }
  | {
    created_time: DatePropertyFilter;
    property: string;
    type: "created_time";
  }
  | {
    last_edited_by: PeoplePropertyFilter;
    property: string;
    type: "last_edited_by";
  }
  | {
    last_edited_time: DatePropertyFilter;
    property: string;
    type: "last_edited_time";
  }
  | { formula: FormulaPropertyFilter; property: string; type: "formula" }
  | { unique_id: NumberPropertyFilter; property: string; type: "unique_id" }
  | { rollup: RollupPropertyFilter; property: string; type: "rollup" };

export const or = <
  T extends
    | PropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
    | { readonly or: ReadonlyArray<PropertyFilter> }
    | { readonly and: ReadonlyArray<PropertyFilter> },
>(conditions: ReadonlyArray<T>): { readonly or: ReadonlyArray<T> } => ({
  or: conditions,
});

export const and = <
  T extends
    | PropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
    | { readonly or: ReadonlyArray<PropertyFilter> }
    | { readonly and: ReadonlyArray<PropertyFilter> },
>(conditions: ReadonlyArray<T>): { readonly and: ReadonlyArray<T> } => ({
  and: conditions,
});

export const createdTime = (
  dateFilter: DatePropertyFilter,
): TimestampCreatedTimeFilter => ({
  created_time: dateFilter,
  timestamp: "created_time",
  type: "created_time",
});

export const lastEditedTime = (
  dateFilter: DatePropertyFilter,
): TimestampLastEditedTimeFilter => ({
  last_edited_time: dateFilter,
  timestamp: "last_edited_time",
  type: "last_edited_time",
});

export * as date from "./filter/date.ts";
