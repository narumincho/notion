import type { BlockId, PageId } from "./id.ts";
import type { UserId } from "./id.ts";
import type { PartialUserObjectResponse } from "./rawType.ts";
import type { ApiColor, RichTextItemResponse } from "./type.ts";

/**
 * ページに含まれるブロックもしくは, ブロックの子ブロックを取得する
 * @see https://developers.notion.com/reference/get-block-children
 */
export const retrieveBlockChildren = async function* (parameter: {
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
   *                             ^ この部分がデータベースの ID
   * ```
   *
   * @example
   * "39aaf5dc888847dbbf3b671067cf3816"
   *
   * @throws {Error} ページもしくはブロックが見つからない場合
   */
  readonly blockId: PageId;

  /**
   * 1回のHTTPリクエストで取得するページの最大数 (最大100)
   *
   * 必要な個数が100未満の場合は, この値を指定することで負荷を減らせそう
   * @default 100
   */
  readonly pageSize?: number | undefined;
}): AsyncGenerator<Block, void, unknown> {
  let cursor: string | undefined = undefined;
  while (true) {
    const url = new URL(
      `https://api.notion.com/v1/blocks/${parameter.blockId}/children`,
    );
    if (typeof cursor === "string") {
      url.searchParams.set("start_cursor", cursor);
    }
    if (typeof parameter.pageSize === "number") {
      url.searchParams.set("page_size", parameter.pageSize.toString());
    }
    const response = await (await fetch(
      url,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${parameter.apiKey}`,
          "Notion-Version": "2022-06-28",
        },
      },
    )).json();
    if (response.object !== "list") {
      throw new Error(
        `Notion API error: ${response.code} ${response.message}`,
      );
    }
    console.log(response);
    if (typeof response.next_cursor === "string") {
      cursor = response.next_cursor;
    } else {
      return;
    }
  }
};

type RawBlock =
  | RawParagraphBlockObjectResponse
  | RawHeading1BlockObjectResponse;

type RawParagraphBlockObjectResponse = {
  readonly type: "paragraph";
  readonly paragraph: {
    readonly rich_text: Array<RichTextItemResponse>;
    readonly color: ApiColor;
  };
  readonly parent:
    | { readonly type: "database_id"; readonly database_id: string }
    | { readonly type: "page_id"; readonly page_id: string }
    | { readonly type: "block_id"; readonly block_id: string }
    | { readonly type: "workspace"; readonly workspace: true };
  readonly object: "block";
  readonly id: string;
  readonly created_time: string;
  readonly created_by: PartialUserObjectResponse;
  readonly last_edited_time: string;
  readonly last_edited_by: PartialUserObjectResponse;
  readonly has_children: boolean;
  readonly in_trash: boolean;
};

export type RawHeading1BlockObjectResponse = {
  readonly type: "heading_1";
  readonly heading_1: {
    readonly rich_text: Array<RichTextItemResponse>;
    readonly color: ApiColor;
    readonly is_toggleable: boolean;
  };
  readonly parent:
    | { readonly type: "database_id"; readonly database_id: string }
    | { readonly type: "page_id"; readonly page_id: string }
    | { readonly type: "block_id"; readonly block_id: string }
    | { readonly type: "workspace"; readonly workspace: true };
  readonly object: "block";
  readonly id: string;
  readonly created_time: string;
  readonly created_by: PartialUserObjectResponse;
  readonly last_edited_time: string;
  readonly last_edited_by: PartialUserObjectResponse;
  readonly has_children: boolean;
  readonly in_trash: boolean;
};

export type Block = {
  readonly id: BlockId;
  readonly createdTime: Date;
  readonly createdByUserId: UserId;
  readonly lastEditedTime: Date;
  readonly lastEditedBy: PartialUserObjectResponse;
  readonly hasChildren: boolean;
  readonly inTrash: boolean;
  readonly content: BlockContent;
};

export type BlockContent = Paragraph | Heading1;

/**
 * https://developers.notion.com/reference/block#paragraph
 */
export type Paragraph = {
  readonly type: "paragraph";
  readonly rich_text: Array<RichTextItemResponse>;
  readonly color: ApiColor;
};

export type Heading1 = {
  readonly type: "heading1";
  readonly rich_text: Array<RichTextItemResponse>;
  readonly color: ApiColor;
  readonly isToggleable: boolean;
};
