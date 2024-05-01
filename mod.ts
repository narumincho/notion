import type { PageId } from "./id.ts";
import type { Page, RichTextItemResponse } from "./queryDatabase.ts";

export * from "./id.ts";
export * from "./queryDatabase.ts";

/**
 * Notion の ID から URL を生成する
 */
export const idToNotionUrl = (id: PageId): URL => {
  return new URL(`https://notion.so/${id}`);
};

/**
 * ページからタイトルを取得する
 */
export const pickTitle = (page: Page): string => {
  for (const property of page.properties.values()) {
    if (
      property.value.type === "richText" &&
      property.value.richTextType === "title"
    ) {
      return richTextToPlainText(property.value.richText);
    }
  }
  throw new Error("title not found");
};

/**
 * リッチテキストをプレーンテキストに変換する
 */
export const richTextToPlainText = (
  richText: ReadonlyArray<RichTextItemResponse>,
): string => {
  return richText.map((text) => text.plainText).join("");
};
