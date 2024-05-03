import type { DatabaseId, PageId, UserId } from "./id.ts";

export type TemplateMentionResponse =
  | TemplateMentionDateTemplateMentionResponse
  | TemplateMentionUserTemplateMentionResponse;

export type TemplateMentionDateTemplateMentionResponse = {
  readonly type: "template_mention_date";
  readonly template_mention_date: "today" | "now";
};

export type TemplateMentionUserTemplateMentionResponse = {
  readonly type: "template_mention_user";
  readonly template_mention_user: "me";
};

export type DateResponse = {
  readonly start: Date;
  readonly end: Date | undefined;
};

export type ApiColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "gray_background"
  | "brown_background"
  | "orange_background"
  | "yellow_background"
  | "green_background"
  | "blue_background"
  | "purple_background"
  | "pink_background"
  | "red_background";

export type RichTextItemResponse = {
  readonly annotations: AnnotationResponse;
  readonly plainText: string;
  readonly href: URL | undefined;
  readonly content: RichTextItemResponseContent;
};

/**
 * https://developers.notion.com/reference/rich-text
 */
export type RichTextItemResponseContent =
  | TextRichTextItemResponse
  | MentionRichTextItemResponse
  | EquationRichTextItemResponse;

/**
 * https://developers.notion.com/reference/rich-text#text
 */
export type TextRichTextItemResponse = {
  /**
   * https://developers.notion.com/reference/rich-text#text
   */
  readonly type: "text";
};

/**
 * https://developers.notion.com/reference/rich-text#mention
 */
export type MentionRichTextItemResponse = {
  /**
   * https://developers.notion.com/reference/rich-text#mention
   */
  readonly type: "mention";
  /**
   * https://developers.notion.com/reference/rich-text#mention
   */
  readonly mention:
    | { readonly type: "user"; readonly userId: UserId }
    | { readonly type: "date"; readonly date: DateResponse }
    | {
      readonly type: "linkPreview";
      readonly linkPreview: URL;
    }
    | {
      readonly type: "templateMention";
      readonly templateMention: TemplateMentionResponse;
    }
    | { readonly type: "page"; readonly pageId: PageId }
    | { readonly type: "database"; readonly databaseId: DatabaseId };
};

/**
 * https://developers.notion.com/reference/rich-text#equation
 */
type EquationRichTextItemResponse = {
  /**
   * https://developers.notion.com/reference/rich-text#equation
   */
  readonly type: "equation";
  /**
   * https://developers.notion.com/reference/rich-text#equation
   */
  readonly equation: string;
};

export type AnnotationResponse = {
  readonly bold: boolean;
  readonly italic: boolean;
  readonly strikethrough: boolean;
  readonly underline: boolean;
  readonly code: boolean;
  readonly color:
    | "default"
    | "gray"
    | "brown"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "red"
    | "gray_background"
    | "brown_background"
    | "orange_background"
    | "yellow_background"
    | "green_background"
    | "blue_background"
    | "purple_background"
    | "pink_background"
    | "red_background";
};
