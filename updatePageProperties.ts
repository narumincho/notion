import type { PageId } from "./id.ts";
import type { PropertyUpdate } from "./property.ts";
import type { EmojiRequest } from "./type.ts";

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
