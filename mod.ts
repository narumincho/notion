import {
  type PageId,
  pageIdFromString,
  type PropertyId,
  propertyIdFromString,
  type SelectId,
  selectIdFromString,
  type UserId,
  userIdFromString,
} from "./id.ts";

export * from "./id.ts";

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
  readonly databaseId: PageId;

  /**
   * 1回のHTTPリクエストで取得するページの最大数 (最大100)
   *
   * 必要な個数が100未満の場合は, この値を指定することで負荷を減らせそう
   * @default 100
   */
  readonly pageSize?: number | undefined;
}): AsyncGenerator<Page, void, unknown> {
  let cursor: string | undefined = undefined;
  while (true) {
    const response: QueryDatabaseRawResponse = await (await fetch(
      `https://api.notion.com/v1/databases/${
        parameter.databaseId.replaceAll("-", "")
      }/query`,
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
        }),
      },
    )).json();
    if (response.object !== "list") {
      throw new Error(
        `Notion API error: ${response.code} ${response.message}`,
      );
    }
    for (const page of response.results) {
      console.log(page.properties);
      yield {
        id: pageIdFromString(page.id),
        createdTime: new Date(page.created_time),
        lastEditedIime: new Date(page.last_edited_time),
        createdByUserId: userIdFromString(page.created_by.id),
        lastEditedByUserId: userIdFromString(page.last_edited_by.id),
        inTrash: page.in_trash,
        properties: new Map(
          Object.entries(page.properties).map((
            [key, value],
          ) => [propertyIdFromString(value.id), {
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

type QueryDatabaseRawResponse = {
  readonly object: "error";
  readonly code: string;
  readonly message: string;
} | {
  readonly object: "list";
  readonly results: ReadonlyArray<{
    readonly object: "page";
    readonly id: string;
    readonly created_time: string;
    readonly last_edited_time: string;
    readonly created_by: {
      readonly object: "user";
      readonly id: string;
    };
    readonly last_edited_by: {
      readonly object: "user";
      readonly id: string;
    };
    readonly in_trash: boolean;
    readonly properties: Record<
      string,
      RawPropertyValue
    >;

    readonly url: string;
    readonly public_url: string | null;
  }>;
  readonly next_cursor: string | null;
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
    readonly date: DateResponse | null;
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
  }; // | {
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
// | { type: "title"; title: Array<RichTextItemResponse>; id: string }
// | {
//   type: "rich_text";
//   rich_text: Array<RichTextItemResponse>;
//   id: string;
// }
// | {
//   type: "people";
//   people: Array<PartialUserObjectResponse | UserObjectResponse>;
//   id: string;
// }
// | { type: "relation"; relation: Array<{ id: string }>; id: string }
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

export type DateResponse = {
  readonly start: string;
  readonly end: string | null;
  // time_zone: TimeZoneRequest | null;
};

export type Page = {
  readonly id: PageId;
  readonly createdTime: Date;
  readonly lastEditedIime: Date;
  readonly createdByUserId: UserId;
  readonly lastEditedByUserId: UserId;
  readonly inTrash: boolean;
  readonly properties: ReadonlyMap<PropertyId, {
    readonly name: string;
    readonly value: PropertyValue;
  }>;
};

export type PropertyValue =
  | { readonly type: "number"; readonly number: number | undefined }
  | { readonly type: "url"; readonly url: URL | undefined }
  | {
    readonly type: "select";
    readonly select: Array<SelectResponse>;
    readonly selectType: "select" | "multi_select" | "status";
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
          id: selectIdFromString(raw.select.id),
          name: raw.select.name,
          color: raw.select.color,
        }],
        selectType: "select",
      };
    case "multi_select":
      return {
        type: "select",
        select: raw.multi_select.map((select) => ({
          id: selectIdFromString(select.id),
          name: select.name,
          color: select.color,
        })),
        selectType: "multi_select",
      };
    case "status":
      return {
        type: "select",
        select: raw.status === null ? [] : [{
          id: selectIdFromString(raw.status.id),
          name: raw.status.name,
          color: raw.status.color,
        }],
        selectType: "status",
      };
    default:
      return { type: "unsupported" };
  }
};

/**
 * Notion の ID から URL を生成する
 */
export const idToNotionUrl = (id: PageId): URL => {
  return new URL(`https://notion.so/${id}`);
};
