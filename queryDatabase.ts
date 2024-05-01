import {
  type DatabaseId,
  databaseIdFrom,
  type PageId,
  pageIdFrom,
  type PropertyId,
  propertyIdFrom,
  type SelectId,
  selectIdFrom,
  type UserId,
  userIdFrom,
} from "./id.ts";

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
    title: Array<RawRichTextItemResponse>;
    readonly id: string;
  }
  | {
    readonly type: "rich_text";
    readonly rich_text: Array<RawRichTextItemResponse>;
    readonly id: string;
  };
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

type RawRichTextItemResponse =
  | RawTextRichTextItemResponse
  | RawMentionRichTextItemResponse
  | RawEquationRichTextItemResponse;

type RawTextRichTextItemResponse = {
  readonly type: "text";
  readonly text: {
    readonly content: string;
    readonly link: { readonly url: string } | null;
  };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};

export type AnnotationResponse = {
  readonly bold: boolean;
  readonly italic: boolean;
  readonly strikethrough: boolean;
  readonly underline: boolean;
  readonly code: boolean;
  readonly color:
    | "default"
    | "gray"
    | "brown"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "red"
    | "gray_background"
    | "brown_background"
    | "orange_background"
    | "yellow_background"
    | "green_background"
    | "blue_background"
    | "purple_background"
    | "pink_background"
    | "red_background";
};

type PartialUserObjectResponse = {
  readonly id: string;
  readonly object: "user";
};

type RawMentionRichTextItemResponse = {
  readonly type: "mention";
  readonly mention:
    | { readonly type: "user"; readonly user: PartialUserObjectResponse }
    | { readonly type: "date"; readonly date: DateResponse }
    | {
      readonly type: "link_preview";
      readonly link_preview: { url: string };
    }
    | {
      readonly type: "template_mention";
      readonly template_mention: TemplateMentionResponse;
    }
    | { readonly type: "page"; readonly page: { readonly id: string } }
    | { readonly type: "database"; readonly database: { readonly id: string } };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};

type TemplateMentionResponse =
  | TemplateMentionDateTemplateMentionResponse
  | TemplateMentionUserTemplateMentionResponse;

type TemplateMentionDateTemplateMentionResponse = {
  readonly type: "template_mention_date";
  readonly template_mention_date: "today" | "now";
};

type TemplateMentionUserTemplateMentionResponse = {
  readonly type: "template_mention_user";
  readonly template_mention_user: "me";
};

type RawEquationRichTextItemResponse = {
  readonly type: "equation";
  readonly equation: { readonly expression: string };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};

export type RichTextItemResponse = {
  readonly annotations: AnnotationResponse;
  readonly plainText: string;
  readonly href: URL | undefined;
  readonly content: RichTextItemResponseContent;
};

/**
 * https://developers.notion.com/reference/rich-text
 */
export type RichTextItemResponseContent =
  | TextRichTextItemResponse
  | MentionRichTextItemResponse
  | EquationRichTextItemResponse;

/**
 * https://developers.notion.com/reference/rich-text#text
 */
export type TextRichTextItemResponse = {
  /**
   * https://developers.notion.com/reference/rich-text#text
   */
  readonly type: "text";
};

/**
 * https://developers.notion.com/reference/rich-text#mention
 */
export type MentionRichTextItemResponse = {
  /**
   * https://developers.notion.com/reference/rich-text#mention
   */
  readonly type: "mention";
  /**
   * https://developers.notion.com/reference/rich-text#mention
   */
  readonly mention:
    | { readonly type: "user"; readonly userId: UserId }
    | { readonly type: "date"; readonly date: DateResponse }
    | {
      readonly type: "linkPreview";
      readonly linkPreview: URL;
    }
    | {
      readonly type: "templateMention";
      readonly templateMention: TemplateMentionResponse;
    }
    | { readonly type: "page"; readonly pageId: PageId }
    | { readonly type: "database"; readonly databaseId: DatabaseId };
};

/**
 * https://developers.notion.com/reference/rich-text#equation
 */
type EquationRichTextItemResponse = {
  /**
   * https://developers.notion.com/reference/rich-text#equation
   */
  readonly type: "equation";
  /**
   * https://developers.notion.com/reference/rich-text#equation
   */
  readonly equation: string;
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
  /**
   * always null
   */
  readonly time_zone: null;
};

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
    readonly date: {
      readonly start: Date;
      readonly end: Date | undefined;
    } | undefined;
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
    default:
      return { type: "unsupported" };
  }
};

const richTextItemResponseFromRaw = (
  raw: RawRichTextItemResponse,
): RichTextItemResponse => {
  switch (raw.type) {
    case "text":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : new URL(raw.href),
        content: {
          type: "text",
        },
      };
    case "mention":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : new URL(raw.href),
        content: {
          type: "mention",
          mention: mentionRichTextItemResponseFromRaw(raw.mention),
        },
      };
    case "equation":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : new URL(raw.href),
        content: {
          type: "equation",
          equation: raw.equation.expression,
        },
      };
  }
};

const mentionRichTextItemResponseFromRaw = (
  raw: RawMentionRichTextItemResponse["mention"],
): MentionRichTextItemResponse["mention"] => {
  switch (raw.type) {
    case "user":
      return { type: "user", userId: userIdFrom(raw.user.id) };
    case "date":
      return { type: "date", date: raw.date };
    case "link_preview":
      return {
        type: "linkPreview",
        linkPreview: new URL(raw.link_preview.url),
      };
    case "template_mention":
      return {
        type: "templateMention",
        templateMention: raw.template_mention,
      };
    case "page":
      return { type: "page", pageId: pageIdFrom(raw.page.id) };
    case "database":
      return {
        type: "database",
        databaseId: databaseIdFrom(raw.database.id),
      };
  }
};
