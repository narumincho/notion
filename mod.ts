import type { PageId } from "./id.ts";
import type { Page, PropertyValue } from "./queryDatabase.ts";
import { RichTextItemResponse } from "./type.ts";

export * from "./id.ts";
export * from "./queryDatabase.ts";
export * from "./type.ts";

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

/**
 * Notionのページのプロパティからテキストを取得する
 */
export const propertyValueToString = (
  property: PropertyValue,
): string => {
  switch (property.type) {
    case "richText":
      return richTextToPlainText(property.richText);
    case "select":
      return property.select.map((select) => select.name).join(", ");
    case "url":
      return property.url?.toString() ?? "";
    case "date":
      return property.date
        ? property.date.start.toISOString() +
          (property.date.end ? `〜${property.date.end.toISOString()}` : "")
        : "";
    case "phoneNumber":
      return property.phoneNumber ?? "";
    case "email":
      return property.email ?? "";
    case "checkbox":
      return property.checkbox ? "true" : "false";
    case "number":
      return property.number?.toString() ?? "";
    case "unsupported":
      return "";
  }
};
