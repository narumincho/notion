import {
  databaseIdFrom,
  pageIdFrom,
  propertyIdFrom,
  selectIdFrom,
  userIdFrom,
} from "./id.ts";
import type {
  RawMentionRichTextItemResponse,
  RawPage,
  RawPropertyValue,
  RawRichTextItemResponse,
} from "./rawType.ts";
import type {
  MentionRichTextItemResponse,
  Page,
  PropertyValue,
  RichTextItemResponse,
} from "./type.ts";
import { createUrl } from "./url.ts";

export const richTextItemResponseFromRaw = (
  raw: RawRichTextItemResponse,
): RichTextItemResponse => {
  switch (raw.type) {
    case "text":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : createUrl(raw.href),
        content: {
          type: "text",
        },
      };
    case "mention":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : createUrl(raw.href),
        content: {
          type: "mention",
          mention: mentionRichTextItemResponseFromRaw(raw.mention),
        },
      };
    case "equation":
      return {
        annotations: raw.annotations,
        plainText: raw.plain_text,
        href: raw.href === null ? undefined : createUrl(raw.href),
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

export function rawPageToPage(page: RawPage): Page {
  return {
    id: pageIdFrom(page.id),
    createdTime: new Date(page.created_time),
    lastEditedTime: new Date(page.last_edited_time),
    createdByUserId: userIdFrom(page.created_by.id),
    lastEditedByUserId: userIdFrom(page.last_edited_by.id),
    inTrash: page.in_trash,
    properties: new Map(
      Object.entries(page.properties).map((
        [key, value],
      ) => [propertyIdFrom(value.id), {
        name: key,
        value: rawPropertyValueToPropertyValue(value),
      }]),
    ),
  };
}

export const rawPropertyValueToPropertyValue = (
  raw: RawPropertyValue,
): PropertyValue => {
  switch (raw.type) {
    case "number":
      return { type: "number", number: raw.number ?? undefined };
    case "url": {
      if (raw.url === null) {
        return {
          type: "url",
          urlType: "empty",
          url: undefined,
          rawUrl: raw.url ?? undefined,
        };
      } else {
        const url = URL.parse(raw.url);
        if (url === null) {
          return {
            type: "url",
            urlType: "invalid",
            url: undefined,
            rawUrl: raw.url,
          };
        } else {
          return {
            type: "url",
            urlType: "valid",
            url: url,
            rawUrl: raw.url,
          };
        }
      }
    }
    case "select":
      return {
        type: "select",
        select: raw.select === null ? [] : [{
          id: selectIdFrom(raw.select.id),
          name: raw.select.name,
          color: raw.select.color,
        }],
        selectType: "select",
      };
    case "multi_select":
      return {
        type: "select",
        select: raw.multi_select.map((select) => ({
          id: selectIdFrom(select.id),
          name: select.name,
          color: select.color,
        })),
        selectType: "multiSelect",
      };
    case "status":
      return {
        type: "select",
        select: raw.status === null ? [] : [{
          id: selectIdFrom(raw.status.id),
          name: raw.status.name,
          color: raw.status.color,
        }],
        selectType: "status",
      };
    case "date":
      return {
        type: "date",
        date: raw.date === null ? undefined : {
          start: new Date(raw.date.start),
          end: raw.date.end === null ? undefined : new Date(raw.date.end),
        },
      };
    case "email":
      return { type: "email", email: raw.email ?? undefined };
    case "phone_number":
      return {
        type: "phoneNumber",
        phoneNumber: raw.phone_number ?? undefined,
      };
    case "checkbox":
      return { type: "checkbox", checkbox: raw.checkbox };
    case "title":
      return {
        type: "richText",
        richText: raw.title.map(richTextItemResponseFromRaw),
        richTextType: "title",
      };
    case "rich_text":
      return {
        type: "richText",
        richText: raw.rich_text.map(richTextItemResponseFromRaw),
        richTextType: "richText",
      };
    case "relation":
      return {
        type: "relation",
        ids: raw.relation.map((relation) => pageIdFrom(relation.id)),
        hasMore: raw.has_more,
      };
    default:
      console.log(raw);
      return { type: "unsupported" };
  }
};
