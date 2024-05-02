import type { AnnotationResponse, TemplateMentionResponse } from "./type.ts";

export type RawRichTextItemResponse =
  | RawTextRichTextItemResponse
  | RawMentionRichTextItemResponse
  | RawEquationRichTextItemResponse;

type RawTextRichTextItemResponse = {
  readonly type: "text";
  readonly text: {
    readonly content: string;
    readonly link: { readonly url: string } | null;
  };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};

export type RawMentionRichTextItemResponse = {
  readonly type: "mention";
  readonly mention:
    | { readonly type: "user"; readonly user: PartialUserObjectResponse }
    | { readonly type: "date"; readonly date: RawDateResponse }
    | {
      readonly type: "link_preview";
      readonly link_preview: { url: string };
    }
    | {
      readonly type: "template_mention";
      readonly template_mention: TemplateMentionResponse;
    }
    | { readonly type: "page"; readonly page: { readonly id: string } }
    | { readonly type: "database"; readonly database: { readonly id: string } };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};

export type PartialUserObjectResponse = {
  readonly id: string;
  readonly object: "user";
};

export type RawDateResponse = {
  readonly start: string;
  readonly end: string | null;
  /**
   * always null
   */
  readonly time_zone: null;
};

type RawEquationRichTextItemResponse = {
  readonly type: "equation";
  readonly equation: { readonly expression: string };
  readonly annotations: AnnotationResponse;
  readonly plain_text: string;
  readonly href: string | null;
};
