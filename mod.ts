export const queryDatabase = async (parameter: {
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
   */
  readonly databaseId: string;
}): Promise<void> => {
  await fetch(
    `https://api.notion.com/v1/databases/${parameter.databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${parameter.apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    },
  );
};
