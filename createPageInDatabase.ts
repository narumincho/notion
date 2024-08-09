import type { DatabaseId, PageId, PropertyId } from "./id.ts";
import { type PageIcon, pageIconToRequestJson, type property } from "./mod.ts";
import type { Block, File } from "./retrieveBlockChildren.ts";
import type { EmojiRequest, PropertyValue } from "./type.ts";

export type CreatePageInDatabaseParameter = {
  /**
   * https://www.notion.so/my-integrations で確認, 発行できる鍵
   * @example
   * "secret_A8nk9U6zyBX4abxzUD6IjKStGzCarqZOJK31P857sGC"
   */
  readonly apiKey: string;

  /**
   * The parent database id where the new page is inserted
   */
  readonly parentDatabaseId: DatabaseId;

  /**
   * The values of the page’s properties. If the parent is a database, then the schema must match the parent database’s properties
   */
  readonly properties: Record<string | PropertyId, PropertyValue>;

  /**
   * The content to be rendered on the new page, represented as an array of block objects.
   */
  readonly children?: ReadonlyArray<Block> | undefined;

  /**
   * The icon of the new page. Either an emoji object or an external file object.
   *
   * TODO: 未指定ならテンプレートのアイコンが使われるか/nullでテンプレートとは違ってアイコンなしになるか確認
   */
  readonly icon?: PageIcon | undefined;

  /**
   * The cover image of the new page
   *
   * TODO ドキュメントとは違って外部ファイルの指定ができないか確認する
   */
  readonly cover?: File | undefined;
};

/**
 * https://developers.notion.com/reference/post-page
 */
export async function createPageInDatabase(
  parameter: CreatePageInDatabaseParameter,
) {
  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${parameter.apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: parameter.parentDatabaseId },
      properties: parameter.properties,
      ...(parameter.icon
        ? { icon: pageIconToRequestJson(parameter.icon) }
        : {}),
      ...(parameter.cover
        ? { cover: pageCoverUpdateToRequestJson(parameter.cover) }
        : {}),
    }),
  });
}
