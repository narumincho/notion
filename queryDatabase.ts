import type { Filter } from "./filter.ts";
import type { DatabaseId } from "./id.ts";
import { rawPageToPage } from "./rawToType.ts";
import type { RawPage } from "./rawType.ts";
import type { Page } from "./type.ts";

/**
 * データベースから指定した条件を満たすページを複数取得する
 *
 * https://developers.notion.com/reference/post-database-query
 */
export async function* queryDatabase(parameter: {
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
  readonly filter?: Filter;
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
      yield rawPageToPage(page);
    }
    if (typeof response.next_cursor === "string") {
      cursor = response.next_cursor;
    } else {
      return;
    }
  }
}

type QueryDatabaseRawResponse = {
  readonly object: "error";
  readonly code: string;
  readonly message: string;
} | {
  readonly object: "list";
  readonly results: ReadonlyArray<RawPage>;
  readonly next_cursor: string | null;
};
