import {
  type DatabaseId,
  type PageId,
  pageIdFrom,
  type PropertyId,
  propertyIdFrom,
  type SelectId,
  selectIdFrom,
  type UserId,
  userIdFrom,
} from "./id.ts";
import { richTextItemResponseFromRaw } from "./rawToType.ts";
import type {
  PartialUserObjectResponse,
  RawDateResponse,
  RawRichTextItemResponse,
} from "./rawType.ts";
import type { DateResponse, RichTextItemResponse } from "./type.ts";

/**
 * データベースから指定した条件を満たすページを複数取得する
 * @see https://developers.notion.com/reference/post-database-query
 */
export const queryDatabase = async function* (parameter: {
  /**
   * https://www.notion.so/my-integrations で確認, 発行できる鍵
   * @example
   * "secret_A8nk9U6zyBX4abxzUD6IjKStGzCarqZOJK31P857sGC"
   */
  readonly apiKey: string;

  /**
   * データベースの ID
   *
   * ページを開いたときの URL に含まれる
   * ```txt
   * https://www.notion.so/39aaf5dc888847dbbf3b671067cf3816?v=1c2ae7b6440241c4a0553eb9f72cd843
   *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *                             ^ この部分がデータベースの ID
   * ```
   *
   * @example
   * "39aaf5dc888847dbbf3b671067cf3816"
   *
   * @throws {Error} データベースが見つからない場合
   */
  readonly databaseId: DatabaseId;

  /**
   * 1回のHTTPリクエストで取得するページの最大数 (最大100)
   *
   * 必要な個数が100未満の場合は, この値を指定することで負荷を減らせそう
   * @default 100
   */
  readonly pageSize?: number | undefined;

  /**
   * https://developers.notion.com/reference/post-database-query-filter
   */
  readonly filter?: PropertyFilter;
}): AsyncGenerator<Page, void, unknown> {
  let cursor: string | undefined = undefined;
  while (true) {
    const response: QueryDatabaseRawResponse = await (await fetch(
      `https://api.notion.com/v1/databases/${parameter.databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${parameter.apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(typeof cursor === "string" ? { start_cursor: cursor } : {}),
          ...(typeof parameter.pageSize === "number"
            ? { page_size: parameter.pageSize }
            : {}),
          ...(parameter.filter === undefined
            ? {}
            : { filter: parameter.filter }),
        }),
      },
    )).json();
    if (response.object !== "list") {
      throw new Error(
        `Notion API error: ${response.code} ${response.message}`,
      );
    }
    for (const page of response.results) {
      yield {
        id: pageIdFrom(page.id),
        createdTime: new Date(page.created_time),
        lastEditedTime: new Date(page.last_edited_time),
        createdByUserId: userIdFrom(page.created_by.id),
        lastEditedByUserId: userIdFrom(page.last_edited_by.id),
        inTrash: page.in_trash,
        properties: new Map(
          Object.entries(page.properties).map((
            [key, value],
          ) => [propertyIdFrom(value.id), {
            name: key,
            value: rawPropertyValueToPropertyValue(value),
          }]),
        ),
      };
    }
    if (typeof response.next_cursor === "string") {
      cursor = response.next_cursor;
    } else {
      return;
    }
  }
};

type TimestampCreatedTimeFilter = {
  created_time: DatePropertyFilter;
  timestamp: "created_time";
  type: "created_time";
};

type TimestampLastEditedTimeFilter = {
  last_edited_time: DatePropertyFilter;
  timestamp: "last_edited_time";
  type: "last_edited_time";
};

type ExistencePropertyFilter = { is_empty: true } | { is_not_empty: true };

type TextPropertyFilter =
  | { equals: string }
  | { does_not_equal: string }
  | { contains: string }
  | { does_not_contain: string }
  | { starts_with: string }
  | { ends_with: string }
  | ExistencePropertyFilter;

type NumberPropertyFilter =
  | { equals: number }
  | { does_not_equal: number }
  | { greater_than: number }
  | { less_than: number }
  | { greater_than_or_equal_to: number }
  | { less_than_or_equal_to: number }
  | ExistencePropertyFilter;

type CheckboxPropertyFilter = { equals: boolean } | { does_not_equal: boolean };

type SelectPropertyFilter =
  | { equals: string }
  | { does_not_equal: string }
  | ExistencePropertyFilter;

type MultiSelectPropertyFilter =
  | { contains: string }
  | { does_not_contain: string }
  | ExistencePropertyFilter;

type StatusPropertyFilter =
  | { equals: string }
  | { does_not_equal: string }
  | ExistencePropertyFilter;

type DatePropertyFilter =
  | { equals: string }
  | { before: string }
  | { after: string }
  | { on_or_before: string }
  | { on_or_after: string }
  | { this_week: Record<string, never> }
  | { past_week: Record<string, never> }
  | { past_month: Record<string, never> }
  | { past_year: Record<string, never> }
  | { next_week: Record<string, never> }
  | { next_month: Record<string, never> }
  | { next_year: Record<string, never> }
  | ExistencePropertyFilter;

type PeoplePropertyFilter =
  | { contains: string }
  | { does_not_contain: string }
  | ExistencePropertyFilter;

type RelationPropertyFilter =
  | { contains: string }
  | { does_not_contain: string }
  | ExistencePropertyFilter;

type FormulaPropertyFilter =
  | { string: TextPropertyFilter }
  | { checkbox: CheckboxPropertyFilter }
  | { number: NumberPropertyFilter }
  | { date: DatePropertyFilter };

type RollupSubfilterPropertyFilter =
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

type RollupPropertyFilter =
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
  | { rollup: RollupPropertyFilter; property: string; type: "rollup" }
  | TimestampCreatedTimeFilter
  | TimestampLastEditedTimeFilter
  | { or: ReadonlyArray<PropertyFilter> }
  | { and: ReadonlyArray<PropertyFilter> };

type QueryDatabaseRawResponse = {
  readonly object: "error";
  readonly code: string;
  readonly message: string;
} | {
  readonly object: "list";
  readonly results: ReadonlyArray<RawPage>;
  readonly next_cursor: string | null;
};

type RawPage = {
  readonly object: "page";
  readonly id: string;
  readonly created_time: string;
  readonly last_edited_time: string;
  readonly created_by: PartialUserObjectResponse;
  readonly last_edited_by: PartialUserObjectResponse;
  readonly in_trash: boolean;
  readonly properties: Record<
    string,
    RawPropertyValue
  >;

  readonly url: string;
  readonly public_url: string | null;
};

type RawPropertyValue =
  | {
    readonly type: "number";
    readonly number: number | null;
    readonly id: string;
  }
  | {
    readonly type: "url";
    readonly url: string | null;
    readonly id: string;
  }
  | {
    readonly type: "select";
    readonly select: PartialSelectResponse | null;
    readonly id: string;
  }
  | {
    readonly type: "multi_select";
    readonly multi_select: Array<PartialSelectResponse>;
    readonly id: string;
  }
  | {
    readonly type: "status";
    readonly status: PartialSelectResponse | null;
    readonly id: string;
  }
  | {
    readonly type: "date";
    readonly date: RawDateResponse | null;
    readonly id: string;
  }
  | {
    readonly type: "email";
    readonly email: string | null;
    readonly id: string;
  }
  | {
    readonly type: "phone_number";
    readonly phone_number: string | null;
    readonly id: string;
  }
  | {
    readonly type: "checkbox";
    readonly checkbox: boolean;
    readonly id: string;
  } // | {
  //   type: "files";
  //   files: Array<
  //     | {
  //       file: { url: string; expiry_time: string };
  //       name: StringRequest;
  //       type?: "file";
  //     }
  //     | {
  //       external: { url: TextRequest };
  //       name: StringRequest;
  //       type?: "external";
  //     }
  //   >;
  //   id: string;
  // }
  // | {
  //   type: "created_by";
  //   created_by: PartialUserObjectResponse | UserObjectResponse;
  //   id: string;
  // }
  // | { type: "created_time"; created_time: string; id: string }
  // | {
  //   type: "last_edited_by";
  //   last_edited_by: PartialUserObjectResponse | UserObjectResponse;
  //   id: string;
  // }
  // | { type: "last_edited_time"; last_edited_time: string; id: string }
  // | { type: "formula"; formula: FormulaPropertyResponse; id: string }
  // | { type: "button"; button: Record<string, never>; id: string }
  // | {
  //   type: "unique_id";
  //   unique_id: { prefix: string | null; number: number | null };
  //   id: string;
  // }
  // | {
  //   type: "verification";
  //   verification:
  //     | VerificationPropertyUnverifiedResponse
  //     | null
  //     | VerificationPropertyResponse
  //     | null;
  //   id: string;
  // }
  | {
    readonly type: "title";
    readonly title: Array<RawRichTextItemResponse>;
    readonly id: string;
  }
  | {
    readonly type: "rich_text";
    readonly rich_text: Array<RawRichTextItemResponse>;
    readonly id: string;
  }
  // | {
  //   type: "people";
  //   people: Array<PartialUserObjectResponse | UserObjectResponse>;
  //   id: string;
  // }
  | {
    readonly type: "relation";
    readonly relation: ReadonlyArray<{ readonly id: string }>;
    readonly id: string;
    /**
     * https://github.com/makenotion/notion-sdk-js/issues/443#issuecomment-2092011027
     */
    readonly has_more: boolean;
  };
// | {
//   type: "rollup";
//   rollup:
//     | { type: "number"; number: number | null; function: RollupFunction }
//     | {
//       type: "date";
//       date: DateResponse | null;
//       function: RollupFunction;
//     }
//     | {
//       type: "array";
//       array: Array<
//         | { type: "number"; number: number | null }
//         | { type: "url"; url: string | null }
//         | { type: "select"; select: PartialSelectResponse | null }
//         | {
//           type: "multi_select";
//           multi_select: Array<PartialSelectResponse>;
//         }
//         | { type: "status"; status: PartialSelectResponse | null }
//         | { type: "date"; date: DateResponse | null }
//         | { type: "email"; email: string | null }
//         | { type: "phone_number"; phone_number: string | null }
//         | { type: "checkbox"; checkbox: boolean }
//         | {
//           type: "files";
//           files: Array<
//             | {
//               file: { url: string; expiry_time: string };
//               name: StringRequest;
//               type?: "file";
//             }
//             | {
//               external: { url: TextRequest };
//               name: StringRequest;
//               type?: "external";
//             }
//           >;
//         }
//         | {
//           type: "created_by";
//           created_by: PartialUserObjectResponse | UserObjectResponse;
//         }
//         | { type: "created_time"; created_time: string }
//         | {
//           type: "last_edited_by";
//           last_edited_by:
//             | PartialUserObjectResponse
//             | UserObjectResponse;
//         }
//         | { type: "last_edited_time"; last_edited_time: string }
//         | { type: "formula"; formula: FormulaPropertyResponse }
//         | { type: "button"; button: Record<string, never> }
//         | {
//           type: "unique_id";
//           unique_id: { prefix: string | null; number: number | null };
//         }
//         | {
//           type: "verification";
//           verification:
//             | VerificationPropertyUnverifiedResponse
//             | null
//             | VerificationPropertyResponse
//             | null;
//         }
//         | { type: "title"; title: Array<RichTextItemResponse> }
//         | { type: "rich_text"; rich_text: Array<RichTextItemResponse> }
//         | {
//           type: "people";
//           people: Array<
//             PartialUserObjectResponse | UserObjectResponse
//           >;
//         }
//         | { type: "relation"; relation: Array<{ id: string }> }
//       >;
//       function: RollupFunction;
//     };
//   id: string;
// }

type PartialSelectResponse = {
  readonly id: string;
  readonly color: SelectColor;
  readonly name: string;
};

export type SelectColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

export type Page = {
  readonly id: PageId;
  readonly createdTime: Date;
  readonly lastEditedTime: Date;
  readonly createdByUserId: UserId;
  readonly lastEditedByUserId: UserId;
  readonly inTrash: boolean;
  readonly properties: ReadonlyMap<PropertyId, {
    readonly name: string;
    readonly value: PropertyValue;
  }>;
};

export type PropertyValue =
  | {
    /**
     * https://developers.notion.com/reference/page-property-values#number
     */
    readonly type: "number";
    readonly number: number | undefined;
  }
  | {
    /**
     * https://developers.notion.com/reference/page-property-values#url
     */
    readonly type: "url";
    readonly url: URL | undefined;
  }
  | {
    /**
     * - select https://developers.notion.com/reference/page-property-values#select
     * - multi_select https://developers.notion.com/reference/page-property-values#multi-select
     * - status https://developers.notion.com/reference/page-property-values#status
     */
    readonly type: "select";
    readonly select: Array<SelectResponse>;
    readonly selectType: "select" | "multiSelect" | "status";
  }
  | {
    /**
     * https://developers.notion.com/reference/page-property-values#date
     */
    readonly type: "date";
    readonly date: DateResponse | undefined;
  }
  | {
    /**
     * https://developers.notion.com/reference/page-property-values#email
     */
    readonly type: "email";
    readonly email: string | undefined;
  }
  | {
    /**
     * https://developers.notion.com/reference/page-property-values#phone-number
     */
    readonly type: "phoneNumber";
    readonly phoneNumber: string | undefined;
  }
  | {
    /**
     * https://developers.notion.com/reference/page-property-values#checkbox
     */
    readonly type: "checkbox";
    readonly checkbox: boolean;
  }
  | {
    /**
     * - title https://developers.notion.com/reference/page-property-values#title
     * - rich_text https://developers.notion.com/reference/page-property-values#rich-text
     */
    readonly type: "richText";
    readonly richText: Array<RichTextItemResponse>;
    readonly richTextType: "title" | "richText";
  }
  | {
    /**
     * https://developers.notion.com/reference/page-property-values#relation
     */
    readonly type: "relation";
    /**
     * An array of related page references. A page reference is an object with an id key and a string value corresponding to a page ID in another database.
     *
     * 画面上で決めた順番通りに取得されます
     */
    readonly ids: ReadonlyArray<PageId>;
    /**
     * If a relation has more than 25 references, then the has_more value for the relation in the response object is true. If a relation doesn’t exceed the limit, then has_more is false.
     */
    readonly hasMore: boolean;
  }
  | { readonly type: "unsupported" };

export type SelectResponse = {
  readonly id: SelectId;
  readonly name: string;
  readonly color: SelectColor;
};

const rawPropertyValueToPropertyValue = (
  raw: RawPropertyValue,
): PropertyValue => {
  switch (raw.type) {
    case "number":
      return { type: "number", number: raw.number ?? undefined };
    case "url":
      return raw.url === null
        ? { type: "url", url: undefined }
        : { type: "url", url: new URL(raw.url) };
    case "select":
      return {
        type: "select",
        select: raw.select === null ? [] : [{
          id: selectIdFrom(raw.select.id),
          name: raw.select.name,
          color: raw.select.color,
        }],
        selectType: "select",
      };
    case "multi_select":
      return {
        type: "select",
        select: raw.multi_select.map((select) => ({
          id: selectIdFrom(select.id),
          name: select.name,
          color: select.color,
        })),
        selectType: "multiSelect",
      };
    case "status":
      return {
        type: "select",
        select: raw.status === null ? [] : [{
          id: selectIdFrom(raw.status.id),
          name: raw.status.name,
          color: raw.status.color,
        }],
        selectType: "status",
      };
    case "date":
      return {
        type: "date",
        date: raw.date === null ? undefined : {
          start: new Date(raw.date.start),
          end: raw.date.end === null ? undefined : new Date(raw.date.end),
        },
      };
    case "email":
      return { type: "email", email: raw.email ?? undefined };
    case "phone_number":
      return {
        type: "phoneNumber",
        phoneNumber: raw.phone_number ?? undefined,
      };
    case "checkbox":
      return { type: "checkbox", checkbox: raw.checkbox };
    case "title":
      return {
        type: "richText",
        richText: raw.title.map(richTextItemResponseFromRaw),
        richTextType: "title",
      };
    case "rich_text":
      return {
        type: "richText",
        richText: raw.rich_text.map(richTextItemResponseFromRaw),
        richTextType: "richText",
      };
    case "relation":
      return {
        type: "relation",
        ids: raw.relation.map((relation) => pageIdFrom(relation.id)),
        hasMore: raw.has_more,
      };
    default:
      console.log(raw);
      return { type: "unsupported" };
  }
};
