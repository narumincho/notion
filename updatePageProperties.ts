import type { PageId } from "./id.ts";
import type { ApiColor, EmojiRequest, SelectColor } from "./type.ts";

export type UpdatePagePropertiesParameter = {
  /**
   * https://www.notion.so/my-integrations で確認, 発行できる鍵
   * @example
   * "secret_A8nk9U6zyBX4abxzUD6IjKStGzCarqZOJK31P857sGC"
   */
  readonly apiKey: string;

  /**
   * ページIDもしくはブロックID
   *
   * ページIDはページを開いたときの URL に含まれる
   * ```txt
   * https://www.notion.so/39aaf5dc888847dbbf3b671067cf3816
   *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *                             ^ この部分がページID
   * ```
   *
   * @example
   * "39aaf5dc888847dbbf3b671067cf3816"
   *
   * @throws {Error} ページもしくはブロックが見つからない場合
   */
  readonly pageId: PageId;

  properties?: Record<
    string,
    PropertyUpdate
  >;
  icon?:
    | { emoji: EmojiRequest; type?: "emoji" }
    | null
    | { external: { url: string }; type?: "external" }
    | null;
  cover?: { external: { url: string }; type?: "external" } | null;
  in_trash?: boolean;
};

export async function updatePageProperties(
  parameter: UpdatePagePropertiesParameter,
): Promise<void> {
  const response = await fetch(
    `https://api.notion.com/v1/pages/${parameter.pageId}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${parameter.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: parameter.properties,
      }),
    },
  );
  console.log(response);
}

export type PropertyUpdate =
  | TitleUpdate
  | RichTextUpdate
  | NumberUpdate
  | UrlUpdate
  | {
    select:
      | {
        id: string;
        name?: string;
        color?: SelectColor;
        description?: string | null;
      }
      | {
        name: string;
        id?: string;
        color?: SelectColor;
        description?: string | null;
      }
      | null;
    type?: "select";
  }
  | {
    multi_select: ReadonlyArray<
      | {
        id: string;
        name?: string;
        color?: SelectColor;
        description?: string | null;
      }
      | {
        name: string;
        id?: string;
        color?: SelectColor;
        description?: string | null;
      }
    >;
    type?: "multi_select";
  }
  | {
    people: ReadonlyArray<
      | { id: string }
      | {
        person: { email?: string };
        id: string;
        type?: "person";
        name?: string | null;
        avatar_url?: string | null;
        object?: "user";
      }
      | {
        bot:
          | Record<string, never>
          | {
            owner:
              | {
                type: "user";
                user:
                  | {
                    type: "person";
                    person: { email: string };
                    name: string | null;
                    avatar_url: string | null;
                    id: string;
                    object: "user";
                  }
                  | { id: string; object: "user" };
              }
              | { type: "workspace"; workspace: true };
            workspace_name: string | null;
          };
        id: string;
        type?: "bot";
        name?: string | null;
        avatar_url?: string | null;
        object?: "user";
      }
    >;
    type?: "people";
  }
  | { email: string | null; type?: "email" }
  | { phone_number: string | null; type?: "phone_number" }
  | { date: DateRequest | null; type?: "date" }
  | { checkbox: boolean; type?: "checkbox" }
  | { relation: ReadonlyArray<{ id: string }>; type?: "relation" }
  | {
    files: ReadonlyArray<
      | {
        file: { url: string; expiry_time?: string };
        name: string;
        type?: "file";
      }
      | {
        external: { url: string };
        name: string;
        type?: "external";
      }
    >;
    type?: "files";
  }
  | {
    status:
      | {
        id: string;
        name?: string;
        color?: SelectColor;
        description?: string | null;
      }
      | null
      | {
        name: string;
        id?: string;
        color?: SelectColor;
        description?: string | null;
      }
      | null;
    type?: "status";
  }
  | null;

export type RichTextItemRequest =
  | {
    text: { content: string; link?: { url: string } | null };
    type: "text";
    annotations?: Annotations;
  }
  | {
    mention:
      | {
        user:
          | { id: string }
          | {
            person: { email?: string };
            id: string;
            type?: "person";
            name?: string | null;
            avatar_url?: string | null;
            object?: "user";
          }
          | {
            bot:
              | Record<string, never>
              | {
                owner:
                  | {
                    type: "user";
                    user:
                      | {
                        type: "person";
                        person: { email: string };
                        name: string | null;
                        avatar_url: string | null;
                        id: string;
                        object: "user";
                      }
                      | { id: string; object: "user" };
                  }
                  | { type: "workspace"; workspace: true };
                workspace_name: string | null;
              };
            id: string;
            type?: "bot";
            name?: string | null;
            avatar_url?: string | null;
            object?: "user";
          };
      }
      | { date: DateRequest }
      | { page: { id: string } }
      | { database: { id: string } }
      | { template_mention: TemplateMentionRequest };
    type: "mention";
    annotations?: Annotations;
  }
  | {
    equation: { expression: string };
    type: "equation";
    annotations?: Annotations;
  };

export type Annotations = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: ApiColor;
};

export type DateRequest = {
  readonly start: string;
  readonly end?: string | null;
};

export type TemplateMentionRequest =
  | {
    readonly template_mention_date: "today" | "now";
    readonly type: "template_mention_date";
  }
  | {
    readonly template_mention_user: "me";
    readonly type: "template_mention_user";
  };

/**
 * https://developers.notion.com/reference/page-property-values#title
 */
export type TitleUpdate = {
  readonly type: "title";
  readonly title: ReadonlyArray<RichTextItemRequest>;
};

/**
 * https://developers.notion.com/reference/page-property-values#title
 */
export function title(
  richText: ReadonlyArray<RichTextItemRequest>,
): TitleUpdate {
  return { type: "title", title: richText };
}

/**
 * https://developers.notion.com/reference/page-property-values#rich-text
 */
export type RichTextUpdate = {
  readonly type: "rich_text";
  readonly rich_text: ReadonlyArray<RichTextItemRequest>;
};

/**
 * https://developers.notion.com/reference/page-property-values#rich-text
 */
export function richText(
  richText: ReadonlyArray<RichTextItemRequest>,
): RichTextUpdate {
  return { type: "rich_text", rich_text: richText };
}

/**
 * https://developers.notion.com/reference/page-property-values#number
 */
export type NumberUpdate = {
  readonly type: "number";
  readonly number: number | null;
};

/**
 * https://developers.notion.com/reference/page-property-values#number
 */
export function number(number: number | undefined): NumberUpdate {
  return { type: "number", number: number ?? null };
}

/**
 * https://developers.notion.com/reference/page-property-values#url
 */
export type UrlUpdate = {
  readonly type: "url";
  readonly url: string | null;
};

/**
 * https://developers.notion.com/reference/page-property-values#url
 */
export function url(url: string | undefined): UrlUpdate {
  return { type: "url", url: url ?? null };
}
