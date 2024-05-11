import type { PageId, PropertyId } from "./id.ts";
import type { PropertyUpdate } from "./property.ts";
import { rawPageToPage } from "./rawToType.ts";
import type { RawPage } from "./rawType.ts";
import type { EmojiRequest, Page } from "./type.ts";

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

  /**
   * The property values to update for the page. The keys are the names or IDs of the property and the values are property values. If a page property ID is not included, then it is not changed.
   */
  readonly properties?:
    | Record<
      string | PropertyId,
      PropertyUpdate
    >
    | undefined;

  /**
   * A page icon for the page.
   */
  readonly icon?: PageIconUpdate | undefined;

  /**
   * A cover for the page.
   */
  readonly cover?: PageCoverUpdate | undefined;

  /**
   * Whether the page is deleted. Set to true to trash a page. Set to false to restore a page.
   */
  readonly inTrash?: boolean | undefined;
};

/**
 * https://developers.notion.com/reference/patch-page
 */
export async function updatePageProperties(
  parameter: UpdatePagePropertiesParameter,
): Promise<Page> {
  const response = await fetch(
    `https://api.notion.com/v1/pages/${parameter.pageId}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${parameter.apiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        properties: parameter.properties,
        ...(parameter.icon
          ? { icon: pageIconUpdateToRequestJson(parameter.icon) }
          : {}),
        ...(parameter.cover
          ? { cover: pageCoverUpdateToRequestJson(parameter.cover) }
          : {}),
        ...(parameter.inTrash ? { in_trash: parameter.inTrash } : {}),
      }),
    },
  );
  console.log(response);
  const json: RawPage = await response.json();
  return rawPageToPage(json);
}

export type PageCoverUpdate = {
  readonly type: "external";
  readonly url: URL;
} | {
  readonly type: "none";
};

function pageCoverUpdateToRequestJson(
  pageCoverUpdate: PageCoverUpdate,
):
  | { readonly external: { readonly url: string }; readonly type: "external" }
  | null {
  switch (pageCoverUpdate.type) {
    case "external":
      return {
        type: "external",
        external: { url: pageCoverUpdate.url.toString() },
      };
    case "none":
      return null;
  }
}

export type PageIconUpdate = {
  readonly type: "emoji";
  readonly emoji: EmojiRequest;
} | {
  readonly type: "external";
  readonly url: URL;
} | {
  readonly type: "none";
};

function pageIconUpdateToRequestJson(
  pageIconUpdate: PageIconUpdate,
):
  | { readonly emoji: string; readonly type: "emoji" }
  | { readonly external: { readonly url: string }; readonly type: "external" }
  | null {
  switch (pageIconUpdate.type) {
    case "emoji":
      return { type: "emoji", emoji: pageIconUpdate.emoji };
    case "external":
      return {
        type: "external",
        external: { url: pageIconUpdate.url.toString() },
      };
    case "none":
      return null;
  }
}
