import { databaseIdFrom, pageIdFrom, userIdFrom } from "./id.ts";
import type {
  RawMentionRichTextItemResponse,
  RawRichTextItemResponse,
} from "./rawType.ts";
import type {
  MentionRichTextItemResponse,
  RichTextItemResponse,
} from "./type.ts";

export const richTextItemResponseFromRaw = (
  raw: RawRichTextItemResponse,
): RichTextItemResponse => {
  switch (raw.type) {
    case "text":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : new URL(raw.href),
        content: {
          type: "text",
        },
      };
    case "mention":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : new URL(raw.href),
        content: {
          type: "mention",
          mention: mentionRichTextItemResponseFromRaw(raw.mention),
        },
      };
    case "equation":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : new URL(raw.href),
        content: {
          type: "equation",
          equation: raw.equation.expression,
        },
      };
  }
};

const mentionRichTextItemResponseFromRaw = (
  raw: RawMentionRichTextItemResponse["mention"],
): MentionRichTextItemResponse["mention"] => {
  switch (raw.type) {
    case "user":
      return { type: "user", userId: userIdFrom(raw.user.id) };
    case "date":
      return {
        type: "date",
        date: {
          start: new Date(raw.date.start),
          end: raw.date.end ? new Date(raw.date.end) : undefined,
        },
      };
    case "link_preview":
      return {
        type: "linkPreview",
        linkPreview: new URL(raw.link_preview.url),
      };
    case "template_mention":
      return {
        type: "templateMention",
        templateMention: raw.template_mention,
      };
    case "page":
      return { type: "page", pageId: pageIdFrom(raw.page.id) };
    case "database":
      return {
        type: "database",
        databaseId: databaseIdFrom(raw.database.id),
      };
  }
};
