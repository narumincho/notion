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
  readonly databaseId: NotionId;

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
      yield { id: notionIdFromString(page.id) };
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
    readonly properties: Record<string, {
      readonly id: string;
      readonly type: string;
    }>;
    readonly url: string;
    readonly public_url: string | null;
  }>;
  readonly next_cursor: string | null;
};

export type NotionId = string & { readonly __brand: unique symbol };

export const notionIdFromString = (id: string): NotionId => {
  if (typeof id !== "string") {
    throw new Error(`Invalid Notion ID: ${id}`);
  }
  const normalized = id.replaceAll("-", "");
  if (!/^[0-9a-f]{32}$/u.test(normalized)) {
    throw new Error(`Invalid Notion ID: ${id}`);
  }
  return normalized as NotionId;
};

export type Page = {
  readonly id: NotionId;
};

/**
 * Notion の ID から URL を生成する. `-` が含まれると開けないため, 除去します
 */
export const idToNotionUrl = (id: NotionId): URL => {
  return new URL(`https://notion.so/${id}`);
};
