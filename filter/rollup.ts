import type { CheckboxPropertyFilter } from "./checkbox.ts";
import type { DatePropertyFilter } from "./date.ts";
import type { MultiSelectPropertyFilter } from "./multiSelect.ts";
import type {
  ExistencePropertyFilter,
  NumberPropertyFilter,
} from "./number.ts";
import type { PeoplePropertyFilter } from "./people.ts";
import type { RelationPropertyFilter } from "./relation.ts";
import type { TextPropertyFilter } from "./richText.ts";
import type { SelectPropertyFilter } from "./select.ts";
import type { StatusPropertyFilter } from "./status.ts";

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

export const any = (
  filter: RollupSubfilterPropertyFilter,
): RollupPropertyFilter => ({
  any: filter,
});

export const none = (
  filter: RollupSubfilterPropertyFilter,
): RollupPropertyFilter => ({
  none: filter,
});

export const every = (
  filter: RollupSubfilterPropertyFilter,
): RollupPropertyFilter => ({
  every: filter,
});

export const date = (filter: DatePropertyFilter): RollupPropertyFilter => ({
  date: filter,
});

export const number = (
  filter: NumberPropertyFilter,
): RollupPropertyFilter => ({
  number: filter,
});

export const subfilterRichText = (
  filter: TextPropertyFilter,
): RollupSubfilterPropertyFilter => ({
  rich_text: filter,
});

export const subfilterNumber = (
  filter: NumberPropertyFilter,
): RollupSubfilterPropertyFilter => ({
  number: filter,
});

export const subfilterCheckbox = (
  filter: CheckboxPropertyFilter,
): RollupSubfilterPropertyFilter => ({
  checkbox: filter,
});

export const subfilterSelect = (
  filter: SelectPropertyFilter,
): RollupSubfilterPropertyFilter => ({
  select: filter,
});

export const subfilterMultiSelect = (
  filter: MultiSelectPropertyFilter,
): RollupSubfilterPropertyFilter => ({
  multi_select: filter,
});

export const subfilterRelation = (
  filter: RelationPropertyFilter,
): RollupSubfilterPropertyFilter => ({
  relation: filter,
});

export const subfilterDate = (
  filter: DatePropertyFilter,
): RollupSubfilterPropertyFilter => ({
  date: filter,
});

export const subfilterPeople = (
  filter: PeoplePropertyFilter,
): RollupSubfilterPropertyFilter => ({
  people: filter,
});

export const subfilterFiles = (
  filter: ExistencePropertyFilter,
): RollupSubfilterPropertyFilter => ({
  files: filter,
});

export const subfilterStatus = (
  filter: StatusPropertyFilter,
): RollupSubfilterPropertyFilter => ({
  status: filter,
});
