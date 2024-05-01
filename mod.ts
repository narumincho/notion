import type { PageId } from "./id.ts";

export * from "./id.ts";
export * from "./queryDatabase.ts";

/**
 * Notion の ID から URL を生成する
 */
export const idToNotionUrl = (id: PageId): URL => {
  return new URL(`https://notion.so/${id}`);
};
