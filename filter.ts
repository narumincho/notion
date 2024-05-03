import type { ExistencePropertyFilter } from "./filter/existence.ts";
import type { DatePropertyFilter } from "./filter/date.ts";
import type { TextPropertyFilter } from "./filter/richText.ts";
import type { NumberPropertyFilter } from "./filter/number.ts";
import type { CheckboxPropertyFilter } from "./filter/checkbox.ts";
import type { SelectPropertyFilter } from "./filter/select.ts";
import type { MultiSelectPropertyFilter } from "./filter/multiSelect.ts";
import type { StatusPropertyFilter } from "./filter/status.ts";
import type { PeoplePropertyFilter } from "./filter/people.ts";
import type { RelationPropertyFilter } from "./filter/relation.ts";
import type { FormulaPropertyFilter } from "./filter/formula.ts";
import type { RollupPropertyFilter } from "./filter/rollup.ts";

export * as date from "./filter/date.ts";
export * as richText from "./filter/richText.ts";
export * as number from "./filter/number.ts";
export * as checkbox from "./filter/checkbox.ts";
export * as select from "./filter/select.ts";
export * as multiSelect from "./filter/multiSelect.ts";
export * as status from "./filter/status.ts";
export * as people from "./filter/people.ts";
export * as relation from "./filter/relation.ts";
export * as formula from "./filter/formula.ts";
export * as rollup from "./filter/rollup.ts";

export type Filter =
  | {
    readonly or: ReadonlyArray<
      | PropertyFilter
      | TimestampCreatedTimeFilter
      | TimestampLastEditedTimeFilter
      | { readonly or: Array<PropertyFilter> }
      | { readonly and: Array<PropertyFilter> }
    >;
  }
  | {
    readonly and: ReadonlyArray<
      | PropertyFilter
      | TimestampCreatedTimeFilter
      | TimestampLastEditedTimeFilter
      | { readonly or: Array<PropertyFilter> }
      | { readonly and: Array<PropertyFilter> }
    >;
  }
  | PropertyFilter
  | TimestampCreatedTimeFilter
  | TimestampLastEditedTimeFilter;

export type TimestampCreatedTimeFilter = {
  readonly created_time: DatePropertyFilter;
  readonly timestamp: "created_time";
  readonly type: "created_time";
};

export type TimestampLastEditedTimeFilter = {
  readonly last_edited_time: DatePropertyFilter;
  readonly timestamp: "last_edited_time";
  readonly type: "last_edited_time";
};

export type PropertyFilter =
  | {
    readonly title: TextPropertyFilter;
    readonly property: string;
    readonly type: "title";
  }
  | {
    readonly rich_text: TextPropertyFilter;
    readonly property: string;
    readonly type: "rich_text";
  }
  | {
    readonly number: NumberPropertyFilter;
    readonly property: string;
    readonly type: "number";
  }
  | {
    readonly checkbox: CheckboxPropertyFilter;
    readonly property: string;
    readonly type: "checkbox";
  }
  | {
    readonly select: SelectPropertyFilter;
    readonly property: string;
    readonly type: "select";
  }
  | {
    readonly multi_select: MultiSelectPropertyFilter;
    readonly property: string;
    readonly type: "multi_select";
  }
  | {
    readonly status: StatusPropertyFilter;
    readonly property: string;
    readonly type: "status";
  }
  | {
    readonly date: DatePropertyFilter;
    readonly property: string;
    readonly type: "date";
  }
  | {
    readonly people: PeoplePropertyFilter;
    readonly property: string;
    readonly type: "people";
  }
  | {
    readonly files: ExistencePropertyFilter;
    readonly property: string;
    readonly type: "files";
  }
  | {
    readonly url: TextPropertyFilter;
    readonly property: string;
    readonly type: "url";
  }
  | {
    readonly email: TextPropertyFilter;
    readonly property: string;
    readonly type: "email";
  }
  | {
    readonly phone_number: TextPropertyFilter;
    readonly property: string;
    readonly type: "phone_number";
  }
  | {
    readonly relation: RelationPropertyFilter;
    readonly property: string;
    readonly type: "relation";
  }
  | {
    readonly created_by: PeoplePropertyFilter;
    readonly property: string;
    readonly type: "created_by";
  }
  | {
    readonly created_time: DatePropertyFilter;
    readonly property: string;
    readonly type: "created_time";
  }
  | {
    readonly last_edited_by: PeoplePropertyFilter;
    readonly property: string;
    readonly type: "last_edited_by";
  }
  | {
    readonly last_edited_time: DatePropertyFilter;
    readonly property: string;
    readonly type: "last_edited_time";
  }
  | {
    readonly formula: FormulaPropertyFilter;
    readonly property: string;
    readonly type: "formula";
  }
  | {
    readonly unique_id: NumberPropertyFilter;
    readonly property: string;
    readonly type: "unique_id";
  }
  | {
    readonly rollup: RollupPropertyFilter;
    readonly property: string;
    readonly type: "rollup";
  };

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

export const propertyTitle = (
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter => ({
  title: textFilter,
  property,
  type: "title",
});

export const propertyRichText = (
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter => ({
  rich_text: textFilter,
  property,
  type: "rich_text",
});

export const propertyNumber = (
  property: string,
  numberFilter: NumberPropertyFilter,
): PropertyFilter => ({
  number: numberFilter,
  property,
  type: "number",
});

export const propertyCheckbox = (
  property: string,
  checkboxFilter: CheckboxPropertyFilter,
): PropertyFilter => ({
  checkbox: checkboxFilter,
  property,
  type: "checkbox",
});

export const propertySelect = (
  property: string,
  selectFilter: SelectPropertyFilter,
): PropertyFilter => ({
  select: selectFilter,
  property,
  type: "select",
});

export const propertyMultiSelect = (
  property: string,
  multiSelectFilter: MultiSelectPropertyFilter,
): PropertyFilter => ({
  multi_select: multiSelectFilter,
  property,
  type: "multi_select",
});

export const propertyStatus = (
  property: string,
  statusFilter: StatusPropertyFilter,
): PropertyFilter => ({
  status: statusFilter,
  property,
  type: "status",
});

export const propertyDate = (
  property: string,
  dateFilter: DatePropertyFilter,
): PropertyFilter => ({
  date: dateFilter,
  property,
  type: "date",
});

export const propertyPeople = (
  property: string,
  peopleFilter: PeoplePropertyFilter,
): PropertyFilter => ({
  people: peopleFilter,
  property,
  type: "people",
});

export const propertyFiles = (
  property: string,
  existenceFilter: ExistencePropertyFilter,
): PropertyFilter => ({
  files: existenceFilter,
  property,
  type: "files",
});

export const propertyUrl = (
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter => ({
  url: textFilter,
  property,
  type: "url",
});

export const propertyEmail = (
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter => ({
  email: textFilter,
  property,
  type: "email",
});

export const propertyPhoneNumber = (
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter => ({
  phone_number: textFilter,
  property,
  type: "phone_number",
});

export const propertyRelation = (
  property: string,
  relationFilter: RelationPropertyFilter,
): PropertyFilter => ({
  relation: relationFilter,
  property,
  type: "relation",
});

export const propertyCreatedBy = (
  property: string,
  peopleFilter: PeoplePropertyFilter,
): PropertyFilter => ({
  created_by: peopleFilter,
  property,
  type: "created_by",
});

export const propertyCreatedTime = (
  property: string,
  dateFilter: DatePropertyFilter,
): PropertyFilter => ({
  created_time: dateFilter,
  property,
  type: "created_time",
});

export const propertyLastEditedBy = (
  property: string,
  peopleFilter: PeoplePropertyFilter,
): PropertyFilter => ({
  last_edited_by: peopleFilter,
  property,
  type: "last_edited_by",
});

export const propertyLastEditedTime = (
  property: string,
  dateFilter: DatePropertyFilter,
): PropertyFilter => ({
  last_edited_time: dateFilter,
  property,
  type: "last_edited_time",
});

export const propertyFormula = (
  property: string,
  formulaFilter: FormulaPropertyFilter,
): PropertyFilter => ({
  formula: formulaFilter,
  property,
  type: "formula",
});

export const propertyUniqueId = (
  property: string,
  numberFilter: NumberPropertyFilter,
): PropertyFilter => ({
  unique_id: numberFilter,
  property,
  type: "unique_id",
});

export const propertyRollup = (
  property: string,
  rollupFilter: RollupPropertyFilter,
): PropertyFilter => ({
  rollup: rollupFilter,
  property,
  type: "rollup",
});
