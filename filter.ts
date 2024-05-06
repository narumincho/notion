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

/**
 * https://developers.notion.com/reference/post-database-query-filter#compound-filter-conditions
 */
export function or<
  T extends
    | PropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
    | { readonly or: ReadonlyArray<PropertyFilter> }
    | { readonly and: ReadonlyArray<PropertyFilter> },
>(conditions: ReadonlyArray<T>): { readonly or: ReadonlyArray<T> } {
  return { or: conditions };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#compound-filter-conditions
 */
export function and<
  T extends
    | PropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
    | { readonly or: ReadonlyArray<PropertyFilter> }
    | { readonly and: ReadonlyArray<PropertyFilter> },
>(conditions: ReadonlyArray<T>): { readonly and: ReadonlyArray<T> } {
  return { and: conditions };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#timestamp
 */
export function createdTime(
  dateFilter: DatePropertyFilter,
): TimestampCreatedTimeFilter {
  return {
    created_time: dateFilter,
    timestamp: "created_time",
    type: "created_time",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#timestamp
 */
export function lastEditedTime(
  dateFilter: DatePropertyFilter,
): TimestampLastEditedTimeFilter {
  return {
    last_edited_time: dateFilter,
    timestamp: "last_edited_time",
    type: "last_edited_time",
  };
}

export function propertyTitle(
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter {
  return {
    title: textFilter,
    property,
    type: "title",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#rich-text
 */
export function propertyRichText(
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter {
  return {
    rich_text: textFilter,
    property,
    type: "rich_text",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#number
 */
export function propertyNumber(
  property: string,
  numberFilter: NumberPropertyFilter,
): PropertyFilter {
  return {
    number: numberFilter,
    property,
    type: "number",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#checkbox
 */
export function propertyCheckbox(
  property: string,
  checkboxFilter: CheckboxPropertyFilter,
): PropertyFilter {
  return {
    checkbox: checkboxFilter,
    property,
    type: "checkbox",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#select
 */
export function propertySelect(
  property: string,
  selectFilter: SelectPropertyFilter,
): PropertyFilter {
  return {
    select: selectFilter,
    property,
    type: "select",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#multi-select
 */
export function propertyMultiSelect(
  property: string,
  multiSelectFilter: MultiSelectPropertyFilter,
): PropertyFilter {
  return {
    multi_select: multiSelectFilter,
    property,
    type: "multi_select",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#status
 */
export function propertyStatus(
  property: string,
  statusFilter: StatusPropertyFilter,
): PropertyFilter {
  return {
    status: statusFilter,
    property,
    type: "status",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#date
 */
export function propertyDate(
  property: string,
  dateFilter: DatePropertyFilter,
): PropertyFilter {
  return {
    date: dateFilter,
    property,
    type: "date",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#people
 */
export function propertyPeople(
  property: string,
  peopleFilter: PeoplePropertyFilter,
): PropertyFilter {
  return {
    people: peopleFilter,
    property,
    type: "people",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#files
 */
export function propertyFiles(
  property: string,
  existenceFilter: ExistencePropertyFilter,
): PropertyFilter {
  return {
    files: existenceFilter,
    property,
    type: "files",
  };
}

export function propertyUrl(
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter {
  return {
    url: textFilter,
    property,
    type: "url",
  };
}

export function propertyEmail(
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter {
  return {
    email: textFilter,
    property,
    type: "email",
  };
}

export function propertyPhoneNumber(
  property: string,
  textFilter: TextPropertyFilter,
): PropertyFilter {
  return {
    phone_number: textFilter,
    property,
    type: "phone_number",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#relation
 */
export function propertyRelation(
  property: string,
  relationFilter: RelationPropertyFilter,
): PropertyFilter {
  return {
    relation: relationFilter,
    property,
    type: "relation",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#people
 */
export function propertyCreatedBy(
  property: string,
  peopleFilter: PeoplePropertyFilter,
): PropertyFilter {
  return {
    created_by: peopleFilter,
    property,
    type: "created_by",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#date
 */
export function propertyCreatedTime(
  property: string,
  dateFilter: DatePropertyFilter,
): PropertyFilter {
  return {
    created_time: dateFilter,
    property,
    type: "created_time",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#people
 */
export function propertyLastEditedBy(
  property: string,
  peopleFilter: PeoplePropertyFilter,
): PropertyFilter {
  return {
    last_edited_by: peopleFilter,
    property,
    type: "last_edited_by",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#date
 */
export function propertyLastEditedTime(
  property: string,
  dateFilter: DatePropertyFilter,
): PropertyFilter {
  return {
    last_edited_time: dateFilter,
    property,
    type: "last_edited_time",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#formula
 */
export function propertyFormula(
  property: string,
  formulaFilter: FormulaPropertyFilter,
): PropertyFilter {
  return {
    formula: formulaFilter,
    property,
    type: "formula",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#id
 */
export function propertyUniqueId(
  property: string,
  numberFilter: NumberPropertyFilter,
): PropertyFilter {
  return {
    unique_id: numberFilter,
    property,
    type: "unique_id",
  };
}

/**
 * https://developers.notion.com/reference/post-database-query-filter#rollup
 */
export function propertyRollup(
  property: string,
  rollupFilter: RollupPropertyFilter,
): PropertyFilter {
  return {
    rollup: rollupFilter,
    property,
    type: "rollup",
  };
}
