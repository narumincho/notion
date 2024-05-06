import {
  type BlockId,
  blockIdFrom,
  commentIdFrom,
  databaseIdFrom,
  type PageId,
  pageIdFrom,
  userIdFrom,
} from "./id.ts";
import type { DatabaseId, UserId } from "./id.ts";
import { richTextItemResponseFromRaw } from "./rawToType.ts";
import type {
  PartialUserObjectResponse,
  RawRichTextItemResponse,
} from "./rawType.ts";
import type {
  ApiColor,
  EmojiRequest,
  LanguageRequest,
  RichTextItemResponse,
} from "./type.ts";

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
   *                             ^ この部分がページID
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
    const response: RawRetrieveBlockChildrenResponse = await (await fetch(
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
    for (const block of response.results) {
      yield {
        id: blockIdFrom(block.id),
        createdTime: new Date(block.created_time),
        createdByUserId: userIdFrom(block.created_by.id),
        lastEditedTime: new Date(block.last_edited_time),
        lastEditedByUserId: userIdFrom(block.last_edited_by.id),
        hasChildren: block.has_children,
        inTrash: block.in_trash,
        parent: (() => {
          switch (block.parent.type) {
            case "database_id":
              return {
                type: "databaseId",
                databaseId: databaseIdFrom(block.parent.database_id),
              };
            case "page_id":
              return {
                type: "pageId",
                pageId: pageIdFrom(block.parent.page_id),
              };
            case "block_id":
              return {
                type: "blockId",
                blockId: blockIdFrom(block.parent.block_id),
              };
            case "workspace":
              return { type: "workspace" };
          }
        })(),
        content: rawBlockToBlockContent(block),
      };
    }
    if (typeof response.next_cursor === "string") {
      cursor = response.next_cursor;
    } else {
      return;
    }
  }
};

type RawRetrieveBlockChildrenResponse = {
  readonly object: "error";
  readonly code: string;
  readonly message: string;
} | {
  readonly object: "list";
  readonly results: ReadonlyArray<RawBlock>;
  readonly next_cursor: string | null;
};

type RawBlock =
  | RawParagraphBlockObjectResponse
  | RawHeading1BlockObjectResponse
  | RawHeading2BlockObjectResponse
  | RawHeading3BlockObjectResponse
  | RawBulletedListItemBlockObjectResponse
  | RawNumberedListItemBlockObjectResponse
  | RawQuoteBlockObjectResponse
  | RawToDoBlockObjectResponse
  | RawToggleBlockObjectResponse
  | RawTemplateBlockObjectResponse
  | RawSyncedBlockBlockObjectResponse
  | RawChildPageBlockObjectResponse
  | RawChildDatabaseBlockObjectResponse
  | RawEquationBlockObjectResponse
  | RawCodeBlockObjectResponse
  | RawCalloutBlockObjectResponse
  | RawDividerBlockObjectResponse
  | RawBreadcrumbBlockObjectResponse
  | RawTableOfContentsBlockObjectResponse
  | RawColumnListBlockObjectResponse
  | RawColumnBlockObjectResponse
  | RawLinkToPageBlockObjectResponse
  | RawTableBlockObjectResponse
  | RawTableRowBlockObjectResponse
  | RawEmbedBlockObjectResponse
  | RawBookmarkBlockObjectResponse
  | RawImageBlockObjectResponse
  | RawVideoBlockObjectResponse
  | RawPdfBlockObjectResponse
  | RawFileBlockObjectResponse
  | RawAudioBlockObjectResponse
  | RawLinkPreviewBlockObjectResponse
  | RawUnsupportedBlockObjectResponse;

type RawParagraphBlockObjectResponse = {
  readonly type: "paragraph";
  readonly paragraph: {
    readonly rich_text: Array<RawRichTextItemResponse>;
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

type RawHeading1BlockObjectResponse = {
  readonly type: "heading_1";
  readonly heading_1: {
    readonly rich_text: Array<RawRichTextItemResponse>;
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

type RawHeading2BlockObjectResponse = {
  type: "heading_2";
  heading_2: {
    rich_text: ReadonlyArray<RawRichTextItemResponse>;
    color: ApiColor;
    is_toggleable: boolean;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawHeading3BlockObjectResponse = {
  type: "heading_3";
  heading_3: {
    rich_text: ReadonlyArray<RawRichTextItemResponse>;
    color: ApiColor;
    is_toggleable: boolean;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawBulletedListItemBlockObjectResponse = {
  type: "bulleted_list_item";
  bulleted_list_item: {
    rich_text: ReadonlyArray<RawRichTextItemResponse>;
    color: ApiColor;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawNumberedListItemBlockObjectResponse = {
  type: "numbered_list_item";
  numbered_list_item: {
    rich_text: ReadonlyArray<RawRichTextItemResponse>;
    color: ApiColor;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawQuoteBlockObjectResponse = {
  type: "quote";
  quote: { rich_text: ReadonlyArray<RawRichTextItemResponse>; color: ApiColor };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawToDoBlockObjectResponse = {
  type: "to_do";
  to_do: {
    rich_text: ReadonlyArray<RawRichTextItemResponse>;
    color: ApiColor;
    checked: boolean;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawToggleBlockObjectResponse = {
  type: "toggle";
  toggle: {
    rich_text: ReadonlyArray<RawRichTextItemResponse>;
    color: ApiColor;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawTemplateBlockObjectResponse = {
  type: "template";
  template: { rich_text: ReadonlyArray<RawRichTextItemResponse> };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawSyncedBlockBlockObjectResponse = {
  type: "synced_block";
  synced_block: {
    synced_from: { type: "block_id"; block_id: string } | null;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawChildPageBlockObjectResponse = {
  type: "child_page";
  child_page: { title: string };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawChildDatabaseBlockObjectResponse = {
  type: "child_database";
  child_database: { title: string };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawEquationBlockObjectResponse = {
  type: "equation";
  equation: { expression: string };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawCodeBlockObjectResponse = {
  type: "code";
  code: {
    rich_text: ReadonlyArray<RawRichTextItemResponse>;
    caption: ReadonlyArray<RawRichTextItemResponse>;
    language: LanguageRequest;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

type RawCalloutBlockObjectResponse = {
  type: "callout";
  callout: {
    rich_text: ReadonlyArray<RawRichTextItemResponse>;
    color: ApiColor;
    icon:
      | { type: "emoji"; emoji: EmojiRequest }
      | { type: "external"; external: { url: string } }
      | { type: "file"; file: { url: string; expiry_time: string } }
      | null;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawDividerBlockObjectResponse = {
  type: "divider";
  divider: Record<string, never>;
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawBreadcrumbBlockObjectResponse = {
  type: "breadcrumb";
  breadcrumb: Record<string, never>;
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawTableOfContentsBlockObjectResponse = {
  type: "table_of_contents";
  table_of_contents: { color: ApiColor };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawColumnListBlockObjectResponse = {
  type: "column_list";
  column_list: Record<string, never>;
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawColumnBlockObjectResponse = {
  type: "column";
  column: Record<string, never>;
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawLinkToPageBlockObjectResponse = {
  type: "link_to_page";
  link_to_page:
    | { type: "page_id"; page_id: string }
    | { type: "database_id"; database_id: string }
    | { type: "comment_id"; comment_id: string };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawTableBlockObjectResponse = {
  type: "table";
  table: {
    has_column_header: boolean;
    has_row_header: boolean;
    table_width: number;
  };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawTableRowBlockObjectResponse = {
  type: "table_row";
  table_row: { cells: Array<ReadonlyArray<RawRichTextItemResponse>> };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawEmbedBlockObjectResponse = {
  type: "embed";
  embed: { url: string; caption: ReadonlyArray<RawRichTextItemResponse> };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawBookmarkBlockObjectResponse = {
  type: "bookmark";
  bookmark: { url: string; caption: ReadonlyArray<RawRichTextItemResponse> };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawImageBlockObjectResponse = {
  type: "image";
  image:
    | {
      type: "external";
      external: { url: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
    }
    | {
      type: "file";
      file: { url: string; expiry_time: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
    };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawVideoBlockObjectResponse = {
  type: "video";
  video:
    | {
      type: "external";
      external: { url: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
    }
    | {
      type: "file";
      file: { url: string; expiry_time: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
    };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawPdfBlockObjectResponse = {
  type: "pdf";
  pdf:
    | {
      type: "external";
      external: { url: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
    }
    | {
      type: "file";
      file: { url: string; expiry_time: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
    };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawFileBlockObjectResponse = {
  type: "file";
  file:
    | {
      type: "external";
      external: { url: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
      name: string;
    }
    | {
      type: "file";
      file: { url: string; expiry_time: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
      name: string;
    };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawAudioBlockObjectResponse = {
  type: "audio";
  audio:
    | {
      type: "external";
      external: { url: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
    }
    | {
      type: "file";
      file: { url: string; expiry_time: string };
      caption: ReadonlyArray<RawRichTextItemResponse>;
    };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawLinkPreviewBlockObjectResponse = {
  type: "link_preview";
  link_preview: { url: string };
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

export type RawUnsupportedBlockObjectResponse = {
  type: "unsupported";
  unsupported: Record<string, unknown>;
  parent:
    | { type: "database_id"; database_id: string }
    | { type: "page_id"; page_id: string }
    | { type: "block_id"; block_id: string }
    | { type: "workspace"; workspace: true };
  object: "block";
  id: string;
  created_time: string;
  created_by: PartialUserObjectResponse;
  last_edited_time: string;
  last_edited_by: PartialUserObjectResponse;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
};

const rawBlockToBlockContent = (rawBlock: RawBlock): BlockContent => {
  switch (rawBlock.type) {
    case "paragraph":
      return {
        type: "paragraph",
        richText: rawBlock.paragraph.rich_text.map(
          richTextItemResponseFromRaw,
        ),
        color: rawBlock.paragraph.color,
      };
    case "heading_1":
      return {
        type: "heading1",
        richText: rawBlock.heading_1.rich_text.map(
          richTextItemResponseFromRaw,
        ),
        color: rawBlock.heading_1.color,
        isToggleable: rawBlock.heading_1.is_toggleable,
      };
    case "heading_2":
      return {
        type: "heading2",
        richText: rawBlock.heading_2.rich_text.map(
          richTextItemResponseFromRaw,
        ),
        color: rawBlock.heading_2.color,
        isToggleable: rawBlock.heading_2.is_toggleable,
      };
    case "heading_3":
      return {
        type: "heading3",
        richText: rawBlock.heading_3.rich_text.map(
          richTextItemResponseFromRaw,
        ),
        color: rawBlock.heading_3.color,
        isToggleable: rawBlock.heading_3.is_toggleable,
      };
    case "bulleted_list_item":
      return {
        type: "bulletedListItem",
        richText: rawBlock.bulleted_list_item.rich_text.map(
          richTextItemResponseFromRaw,
        ),
        color: rawBlock.bulleted_list_item.color,
      };
    case "numbered_list_item":
      return {
        type: "numberedListItem",
        richText: rawBlock.numbered_list_item.rich_text.map(
          richTextItemResponseFromRaw,
        ),
        color: rawBlock.numbered_list_item.color,
      };
    case "quote":
      return {
        type: "quote",
        richText: rawBlock.quote.rich_text.map(richTextItemResponseFromRaw),
        color: rawBlock.quote.color,
      };
    case "to_do":
      return {
        type: "toDo",
        rich_text: rawBlock.to_do.rich_text.map(richTextItemResponseFromRaw),
        color: rawBlock.to_do.color,
        checked: rawBlock.to_do.checked,
      };
    case "toggle":
      return {
        type: "toggle",
        rich_text: rawBlock.toggle.rich_text.map(richTextItemResponseFromRaw),
        color: rawBlock.toggle.color,
      };
    case "template":
      return {
        type: "template",
        rich_text: rawBlock.template.rich_text.map(richTextItemResponseFromRaw),
      };
    case "synced_block":
      return {
        type: "syncedBlock",
        blockId: rawBlock.synced_block.synced_from?.block_id
          ? blockIdFrom(rawBlock.synced_block.synced_from.block_id)
          : undefined,
      };
    case "child_page":
      return {
        type: "childPage",
        title: rawBlock.child_page.title,
        pageId: pageIdFrom(rawBlock.id),
      };
    case "child_database":
      return {
        type: "childDatabase",
        title: rawBlock.child_database.title,
        databaseId: databaseIdFrom(rawBlock.id),
      };
    case "equation":
      return {
        type: "equation",
        expression: rawBlock.equation.expression,
      };
    case "code":
      return {
        type: "code",
        rich_text: rawBlock.code.rich_text.map(richTextItemResponseFromRaw),
        caption: rawBlock.code.caption.map(richTextItemResponseFromRaw),
        language: rawBlock.code.language,
      };
    case "callout":
      return {
        type: "callout",
        rich_text: rawBlock.callout.rich_text.map(richTextItemResponseFromRaw),
        color: rawBlock.callout.color,
        icon: (() => {
          switch (rawBlock.callout.icon?.type) {
            case "emoji":
              return {
                type: "emoji",
                emoji: rawBlock.callout.icon.emoji,
              };
            case "external":
              return {
                type: "external",
                url: new URL(rawBlock.callout.icon.external.url),
              };
            case "file":
              return {
                type: "file",
                url: new URL(rawBlock.callout.icon.file.url),
                expiryTime: new Date(rawBlock.callout.icon.file.expiry_time),
              };
            default:
              return undefined;
          }
        })(),
      };
    case "divider":
      return { type: "divider" };
    case "breadcrumb":
      return { type: "breadcrumb" };
    case "table_of_contents":
      return {
        type: "tableOfContents",
        color: rawBlock.table_of_contents.color,
      };
    case "column_list":
      return { type: "columnList" };
    case "column":
      return { type: "column" };
    case "link_to_page":
      switch (rawBlock.link_to_page.type) {
        case "page_id":
          return {
            type: "linkToPage",
            linkToPageType: "pageId",
            pageId: pageIdFrom(rawBlock.link_to_page.page_id),
          };
        case "database_id":
          return {
            type: "linkToPage",
            linkToPageType: "databaseId",
            databaseId: databaseIdFrom(rawBlock.link_to_page.database_id),
          };
        case "comment_id":
          return {
            type: "linkToPage",
            linkToPageType: "commentId",
            commentId: commentIdFrom(rawBlock.link_to_page.comment_id),
          };
        default:
          return { type: "unsupported" };
      }
    case "table":
      return {
        type: "table",
        hasColumnHeader: rawBlock.table.has_column_header,
        hasRowHeader: rawBlock.table.has_row_header,
        tableWidth: rawBlock.table.table_width,
      };
    case "table_row":
      return {
        type: "tableRow",
        cells: rawBlock.table_row.cells.map((cell) =>
          cell.map(richTextItemResponseFromRaw)
        ),
      };
    case "embed":
      return {
        type: "embed",
        url: new URL(rawBlock.embed.url),
        caption: rawBlock.embed.caption.map(richTextItemResponseFromRaw),
      };
    case "bookmark":
      return {
        type: "bookmark",
        url: new URL(rawBlock.bookmark.url),
        caption: rawBlock.bookmark.caption.map(richTextItemResponseFromRaw),
      };
    case "image":
      switch (rawBlock.image.type) {
        case "external":
          return {
            type: "image",
            file: {
              type: "external",
              url: new URL(rawBlock.image.external.url),
            },
            caption: rawBlock.image.caption.map(richTextItemResponseFromRaw),
          };
        case "file":
          return {
            type: "image",
            file: {
              type: "file",
              url: new URL(rawBlock.image.file.url),
              expiryTime: new Date(rawBlock.image.file.expiry_time),
            },
            caption: rawBlock.image.caption.map(richTextItemResponseFromRaw),
          };
        default:
          return { type: "unsupported" };
      }
    case "video":
      switch (rawBlock.video.type) {
        case "external":
          return {
            type: "video",
            file: {
              type: "external",
              url: new URL(rawBlock.video.external.url),
            },
            caption: rawBlock.video.caption.map(richTextItemResponseFromRaw),
          };
        case "file":
          return {
            type: "video",
            file: {
              type: "file",
              url: new URL(rawBlock.video.file.url),
              expiryTime: new Date(rawBlock.video.file.expiry_time),
            },
            caption: rawBlock.video.caption.map(richTextItemResponseFromRaw),
          };
        default:
          return { type: "unsupported" };
      }
    case "pdf":
      switch (rawBlock.pdf.type) {
        case "external":
          return {
            type: "pdf",
            file: {
              type: "external",
              url: new URL(rawBlock.pdf.external.url),
            },
            caption: rawBlock.pdf.caption.map(richTextItemResponseFromRaw),
          };
        case "file":
          return {
            type: "pdf",
            file: {
              type: "file",
              url: new URL(rawBlock.pdf.file.url),
              expiryTime: new Date(rawBlock.pdf.file.expiry_time),
            },
            caption: rawBlock.pdf.caption.map(richTextItemResponseFromRaw),
          };
        default:
          return { type: "unsupported" };
      }
    case "file":
      switch (rawBlock.file.type) {
        case "external":
          return {
            type: "file",
            file: {
              type: "external",
              url: new URL(rawBlock.file.external.url),
            },
            caption: rawBlock.file.caption.map(richTextItemResponseFromRaw),
            name: rawBlock.file.name,
          };
        case "file":
          return {
            type: "file",
            file: {
              type: "file",
              url: new URL(rawBlock.file.file.url),
              expiryTime: new Date(rawBlock.file.file.expiry_time),
            },
            caption: rawBlock.file.caption.map(richTextItemResponseFromRaw),
            name: rawBlock.file.name,
          };
        default:
          return { type: "unsupported" };
      }
    case "audio":
      switch (rawBlock.audio.type) {
        case "external":
          return {
            type: "audio",
            file: {
              type: "external",
              url: new URL(rawBlock.audio.external.url),
            },
            caption: rawBlock.audio.caption.map(richTextItemResponseFromRaw),
          };
        case "file":
          return {
            type: "audio",
            file: {
              type: "file",
              url: new URL(rawBlock.audio.file.url),
              expiryTime: new Date(rawBlock.audio.file.expiry_time),
            },
            caption: rawBlock.audio.caption.map(richTextItemResponseFromRaw),
          };
        default:
          return { type: "unsupported" };
      }
    case "link_preview":
      return {
        type: "linkPreview",
        url: new URL(rawBlock.link_preview.url),
      };
    default:
      return { type: "unsupported" };
  }
};

export type Block = {
  readonly id: BlockId;
  readonly createdTime: Date;
  readonly createdByUserId: UserId;
  readonly lastEditedTime: Date;
  readonly lastEditedByUserId: UserId;
  readonly hasChildren: boolean;
  readonly inTrash: boolean;
  readonly parent: {
    readonly type: "databaseId";
    readonly databaseId: DatabaseId;
  } | {
    readonly type: "pageId";
    readonly pageId: PageId;
  } | {
    readonly type: "blockId";
    readonly blockId: BlockId;
  } | {
    readonly type: "workspace";
  };
  readonly content: BlockContent;
};

export type BlockContent =
  | Paragraph
  | Heading1
  | Heading2
  | Heading3
  | BulletedListItem
  | NumberedListItem
  | Quote
  | ToDo
  | Toggle
  | Template
  | SyncedBlock
  | ChildPage
  | ChildDatabase
  | Equation
  | Code
  | Callout
  | Divider
  | Breadcrumb
  | TableOfContents
  | ColumnList
  | Column
  | LinkToPage
  | Table
  | TableRow
  | Embed
  | Bookmark
  | Image
  | Video
  | Pdf
  | File
  | Audio
  | LinkPreview
  | Unsupported;

/**
 * https://developers.notion.com/reference/block#paragraph
 */
export type Paragraph = {
  readonly type: "paragraph";
  readonly richText: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
};

/**
 * https://developers.notion.com/reference/block#headings
 */
export type Heading1 = {
  readonly type: "heading1";
  readonly richText: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
  readonly isToggleable: boolean;
};

/**
 * https://developers.notion.com/reference/block#headings
 */
export type Heading2 = {
  readonly type: "heading2";
  readonly richText: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
  readonly isToggleable: boolean;
};

/**
 * https://developers.notion.com/reference/block#headings
 */
export type Heading3 = {
  readonly type: "heading3";
  readonly richText: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
  readonly isToggleable: boolean;
};

/**
 * https://developers.notion.com/reference/block#bulleted-list-item
 */
export type BulletedListItem = {
  readonly type: "bulletedListItem";
  readonly richText: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
};

/**
 * https://developers.notion.com/reference/block#numbered-list-item
 */
export type NumberedListItem = {
  readonly type: "numberedListItem";
  readonly richText: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
};

/**
 * https://developers.notion.com/reference/block#quote
 */
export type Quote = {
  readonly type: "quote";
  readonly richText: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
};

/**
 * https://developers.notion.com/reference/block#to-do
 */
export type ToDo = {
  readonly type: "toDo";
  readonly rich_text: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
  readonly checked: boolean;
};

/**
 * https://developers.notion.com/reference/block#toggle-blocks
 */
export type Toggle = {
  readonly type: "toggle";
  readonly rich_text: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
};

/**
 * https://developers.notion.com/reference/block#template
 * @deprecated
 */
export type Template = {
  readonly type: "template";
  readonly rich_text: ReadonlyArray<RichTextItemResponse>;
};

/**
 * https://developers.notion.com/reference/block#synced-block
 */
export type SyncedBlock = {
  readonly type: "syncedBlock";
  readonly blockId: BlockId | undefined;
};

/**
 * https://developers.notion.com/reference/block#child-page
 */
export type ChildPage = {
  readonly type: "childPage";
  readonly title: string;
  readonly pageId: PageId;
};

/**
 * https://developers.notion.com/reference/block#child-database
 */
export type ChildDatabase = {
  readonly type: "childDatabase";
  readonly title: string;
  readonly databaseId: DatabaseId;
};

/**
 * https://developers.notion.com/reference/block#equation
 */
export type Equation = {
  readonly type: "equation";
  readonly expression: string;
};

/**
 * https://developers.notion.com/reference/block#code
 */
export type Code = {
  readonly type: "code";
  readonly rich_text: ReadonlyArray<RichTextItemResponse>;
  readonly caption: ReadonlyArray<RichTextItemResponse>;
  readonly language: LanguageRequest;
};

/**
 * https://developers.notion.com/reference/block#callout
 */
export type Callout = {
  readonly type: "callout";
  readonly rich_text: ReadonlyArray<RichTextItemResponse>;
  readonly color: ApiColor;
  readonly icon:
    | { readonly type: "emoji"; readonly emoji: EmojiRequest }
    | { readonly type: "external"; readonly url: URL }
    | {
      readonly type: "file";
      readonly url: URL;
      readonly expiryTime: Date;
    }
    | undefined;
};

/**
 * https://developers.notion.com/reference/block#divider
 */
export type Divider = {
  readonly type: "divider";
};

/**
 * https://developers.notion.com/reference/block#breadcrumb
 */
export type Breadcrumb = {
  readonly type: "breadcrumb";
};

/**
 * https://developers.notion.com/reference/block#table-of-contents
 */
export type TableOfContents = {
  readonly type: "tableOfContents";
  readonly color: ApiColor;
};

/**
 * https://developers.notion.com/reference/block#column-list-and-column
 */
export type ColumnList = {
  readonly type: "columnList";
};

/**
 * https://developers.notion.com/reference/block#column-list-and-column
 */
export type Column = {
  readonly type: "column";
};

/**
 * https://developers.notion.com/reference/block#link-to-page
 */
export type LinkToPage =
  | {
    readonly type: "linkToPage";
    readonly linkToPageType: "pageId";
    readonly pageId: PageId;
  }
  | {
    readonly type: "linkToPage";
    readonly linkToPageType: "databaseId";
    readonly databaseId: DatabaseId;
  }
  | {
    readonly type: "linkToPage";
    readonly linkToPageType: "commentId";
    readonly commentId: string;
  };

/**
 * https://developers.notion.com/reference/block#table
 */
export type Table = {
  readonly type: "table";
  readonly hasColumnHeader: boolean;
  readonly hasRowHeader: boolean;
  readonly tableWidth: number;
};

/**
 * https://developers.notion.com/reference/block#table-rows
 */
export type TableRow = {
  readonly type: "tableRow";
  readonly cells: ReadonlyArray<ReadonlyArray<RichTextItemResponse>>;
};

/**
 * https://developers.notion.com/reference/block#embed
 */
export type Embed = {
  readonly type: "embed";
  readonly url: URL;
  readonly caption: ReadonlyArray<RichTextItemResponse>;
};

/**
 * https://developers.notion.com/reference/block#bookmark
 */
export type Bookmark = {
  readonly type: "bookmark";
  readonly url: URL;
  readonly caption: ReadonlyArray<RichTextItemResponse>;
};

/**
 * https://developers.notion.com/reference/block#image
 */
export type Image = {
  readonly type: "image";
  readonly file: FileObject;
  readonly caption: ReadonlyArray<RichTextItemResponse>;
};

/**
 * https://developers.notion.com/reference/block#video
 */
export type Video = {
  readonly type: "video";
  readonly file: FileObject;
  readonly caption: ReadonlyArray<RichTextItemResponse>;
};

/**
 * https://developers.notion.com/reference/block#pdf
 */
export type Pdf = {
  readonly type: "pdf";
  readonly file: FileObject;
  readonly caption: ReadonlyArray<RichTextItemResponse>;
};

/**
 * https://developers.notion.com/reference/block#file
 */
export type File = {
  readonly type: "file";
  readonly file: FileObject;
  readonly caption: ReadonlyArray<RichTextItemResponse>;
  readonly name: string;
};

export type Audio = {
  readonly type: "audio";
  readonly file: FileObject;
  readonly caption: ReadonlyArray<RichTextItemResponse>;
};

export type LinkPreview = {
  readonly type: "linkPreview";
  readonly url: URL;
};

export type Unsupported = {
  readonly type: "unsupported";
};

/**
 * https://developers.notion.com/reference/file-object
 */
export type FileObject = {
  readonly type: "file";
  readonly url: URL;
  readonly expiryTime: Date;
} | {
  readonly type: "external";
  readonly url: URL;
};
