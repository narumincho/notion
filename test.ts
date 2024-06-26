import {
  filter,
  getPropertyValueById,
  pageIdFrom,
  property,
  propertyIdFrom,
  queryDatabase,
  selectIdFrom,
  updatePageProperties,
  userIdFrom,
} from "./mod.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertRejects,
} from "jsr:@std/assert";
import secret from "./secret.json" with { type: "json" };
import { blockIdFrom, databaseIdFrom } from "./id.ts";
import { retrieveBlockChildren } from "./retrieveBlockChildren.ts";

const { apiKey } = secret;

Deno.test("queryDatabase one", async () => {
  const pages = await Array.fromAsync(
    queryDatabase({
      apiKey,
      databaseId: databaseIdFrom("a1cb2e5ca6f94399a835fdcd39a828cb"),
      filter: filter.createdTime(
        filter.date.before(new Date("2024-04-29T00:00:00.000Z")),
      ),
    }),
  );
  const [firstPage] = pages;
  assertEquals(pages.length, 1);
  if (firstPage === undefined) {
    throw new Error("No page found");
  }
  assertEquals(
    firstPage.id,
    pageIdFrom("e3389b1b7e7841c9835155b8f4757dbe"),
  );
  assertEquals(
    firstPage.createdByUserId,
    userIdFrom("b98a5d4e7d88422b8e58dcf58d45b7f0"),
  );
  assertEquals(
    firstPage.createdTime,
    new Date("2024-04-27T12:18:00.000Z"),
  );
  assertEquals(firstPage.inTrash, false);
  expectArrayEquivalence(
    firstPage.properties,
    [
      {
        id: propertyIdFrom("title"),
        name: "名前",
        value: {
          type: "richText",
          richTextType: "title",
          richText: [
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: undefined,
              plainText: "A ",
              content: {
                type: "text",
              },
            },
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              content: {
                type: "mention",
                mention: {
                  type: "user",
                  userId: userIdFrom(
                    "b98a5d4e7d88422b8e58dcf58d45b7f0",
                  ),
                },
              },
              href: undefined,
              plainText: "@Anonymous",
            },
          ],
        },
      },

      {
        id: propertyIdFrom("ycLe"),
        name: "タグ",
        value: {
          type: "select",
          select: [
            {
              id: selectIdFrom("392f963c2cc44009a24121b704c04042"),
              name: "あ",
              color: "green",
            },
          ],
          selectType: "multiSelect",
        },
      },

      {
        id: propertyIdFrom("BjF%5D"),
        name: "日付",
        value: {
          type: "date",
          date: {
            start: new Date("2024-04-29T03:00:00.000Z"),
            end: undefined,
          },
        },
      },
      {
        id: propertyIdFrom("ZX%3CB"),
        name: "ステータス",
        value: {
          type: "select",
          select: [
            {
              id: selectIdFrom("adde31eb4432411d846c43059dad2f58"),
              name: "未着手",
              color: "default",
            },
          ],
          selectType: "status",
        },
      },

      {
        id: propertyIdFrom("%3AY%5C%5D"),
        name: "データベーステストとのリレーション",
        value: {
          type: "relation",
          hasMore: false,
          ids: [
            pageIdFrom("0538d3d5058a484bb4db1a911fffaec9"),
            pageIdFrom("e3389b1b7e7841c9835155b8f4757dbe"),
            pageIdFrom("6a4e6099317f4803bf412c9899bade8c"),
          ],
        },
      },
      {
        id: propertyIdFrom("Yxvy"),
        name: "URL",
        value: {
          type: "url",
          urlType: "invalid",
          url: undefined,
          rawUrl: "不正なURL",
        },
      },
    ],
  );
});

const expectArrayEquivalence = <T>(
  actual: ReadonlyArray<T>,
  expected: ReadonlyArray<T>,
) => {
  assertArrayIncludes(actual, expected);
  assertArrayIncludes(expected, actual);
};

Deno.test("queryDatabase not found", async () => {
  await assertRejects(
    async () => {
      for await (
        const page of queryDatabase({
          apiKey,
          databaseId: databaseIdFrom("f0c37c083b574327a1bf65bea3130dd6"),
        })
      ) {
        console.log(page);
      }
    },
    Error,
    "object_not_found",
  );
});

Deno.test("retrieveBlockChildren one", async () => {
  const pageId = pageIdFrom("b0d037d8b54044dca71cd0350b5f3001");
  assertEquals(
    await Array.fromAsync(retrieveBlockChildren({
      apiKey,
      blockId: pageId,
    })),
    [
      {
        content: {
          color: "default",
          richText: [
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: undefined,
              plainText: "本文サンプル",
              content: {
                type: "text",
              },
            },
          ],
          type: "paragraph",
        },
        parent: {
          type: "pageId",
          pageId,
        },
        createdByUserId: userIdFrom("b98a5d4e7d88422b8e58dcf58d45b7f0"),
        createdTime: new Date("2024-05-01T09:28:00.000Z"),
        hasChildren: false,
        id: blockIdFrom("6b4b9ca65d424a32a730c692023d14f6"),
        inTrash: false,
        lastEditedByUserId: userIdFrom("b98a5d4e-7d88-422b-8e58-dcf58d45b7f0"),
        lastEditedTime: new Date("2024-05-01T09:28:00.000Z"),
      },
      {
        content: {
          color: "default",
          richText: [
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: undefined,
              content: {
                type: "mention",
                mention: {
                  type: "date",
                  date: {
                    start: new Date("2024-05-01"),
                    end: undefined,
                  },
                },
              },
              plainText: "2024-05-01",
            },
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: undefined,
              plainText: " ",
              content: {
                type: "text",
              },
            },
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: undefined,
              content: {
                type: "mention",
                mention: {
                  type: "user",
                  userId: userIdFrom("b98a5d4e-7d88-422b-8e58-dcf58d45b7f0"),
                },
              },
              plainText: "@Anonymous",
            },
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: undefined,
              plainText: " ",
              content: {
                type: "text",
              },
            },
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: new URL(
                "https://www.notion.so/22961d0ee2924074a22ce37f405b941a",
              ),
              content: {
                type: "mention",
                mention: {
                  type: "page",
                  pageId: pageIdFrom("22961d0e-e292-4074-a22c-e37f405b941a"),
                },
              },
              plainText: "Untitled",
            },
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              href: undefined,
              plainText: " ",
              content: { type: "text" },
            },
          ],
          type: "paragraph",
        },
        parent: {
          type: "pageId",
          pageId,
        },
        createdByUserId: userIdFrom("b98a5d4e7d88422b8e58dcf58d45b7f0"),
        createdTime: new Date("2024-05-01T09:28:00.000Z"),
        hasChildren: false,
        id: blockIdFrom("7588e21e214e4e4c905166c1944914bc"),
        inTrash: false,
        lastEditedByUserId: userIdFrom("b98a5d4e-7d88-422b-8e58-dcf58d45b7f0"),
        lastEditedTime: new Date("2024-05-01T09:29:00.000Z"),
      },
      {
        content: {
          color: "gray_background",
          icon: {
            emoji: "💡",
            type: "emoji",
          },
          richText: [
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              content: {
                type: "text",
              },
              href: undefined,
              plainText: "別で取得しなきゃ無理だよね?",
            },
          ],
          type: "callout",
        },
        parent: {
          type: "pageId",
          pageId,
        },
        createdByUserId: userIdFrom("b98a5d4e7d88422b8e58dcf58d45b7f0"),
        createdTime: new Date("2024-05-01T10:12:00.000Z"),
        hasChildren: false,
        id: blockIdFrom("59ec4425dde349ddb61daa6d7760ff02"),
        inTrash: false,
        lastEditedByUserId: userIdFrom("b98a5d4e-7d88-422b-8e58-dcf58d45b7f0"),
        lastEditedTime: new Date("2024-05-01T10:12:00.000Z"),
      },
      {
        content: {
          type: "embed",
          caption: [],
          url: new URL(
            "https://twitter.com/naru_mincho/status/1779839425968812093",
          ),
        },
        parent: {
          type: "pageId",
          pageId,
        },
        createdByUserId: userIdFrom("b98a5d4e7d88422b8e58dcf58d45b7f0"),
        createdTime: new Date("2024-05-01T10:13:00.000Z"),
        hasChildren: false,
        id: blockIdFrom("86915bd462a34e1ebf27474cd06a63c1"),
        inTrash: false,
        lastEditedByUserId: userIdFrom("b98a5d4e-7d88-422b-8e58-dcf58d45b7f0"),
        lastEditedTime: new Date("2024-05-01T10:13:00.000Z"),
      },
      {
        content: {
          type: "quote",
          color: "red",
          richText: [
            {
              annotations: {
                bold: false,
                code: false,
                color: "default",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              content: {
                type: "text",
              },
              href: undefined,
              plainText: "aa ",
            },
            {
              annotations: {
                bold: false,
                code: false,
                color: "red",
                italic: false,
                strikethrough: false,
                underline: false,
              },
              content: {
                type: "text",
              },
              href: undefined,
              plainText: "red",
            },
          ],
        },
        parent: {
          type: "pageId",
          pageId,
        },
        createdByUserId: userIdFrom("b98a5d4e7d88422b8e58dcf58d45b7f0"),
        createdTime: new Date("2024-05-04T10:55:00.000Z"),
        hasChildren: false,
        id: blockIdFrom("d76aa3d5d6f44b99a0581a859c4f96e6"),
        inTrash: false,
        lastEditedByUserId: userIdFrom("b98a5d4e-7d88-422b-8e58-dcf58d45b7f0"),
        lastEditedTime: new Date("2024-05-04T10:55:00.000Z"),
      },
    ],
  );
});

Deno.test("updatePageProperties", async () => {
  const pageId = pageIdFrom("6a4e6099317f4803bf412c9899bade8c");
  const pageA = await updatePageProperties({
    apiKey,
    pageId,
    properties: {
      "URL": property.url(new URL("https://example.com")),
    },
  });
  assertEquals(pageA.id, pageId);
  assertEquals(
    getPropertyValueById(pageA.properties, propertyIdFrom("Yxvy")),
    {
      type: "url",
      urlType: "valid",
      url: new URL("https://example.com"),
      rawUrl: "https://example.com/",
    },
  );
  const pageB = await updatePageProperties({
    apiKey,
    pageId,
    properties: {
      "URL": property.url(new URL("https://narumincho.com")),
    },
  });
  assertEquals(pageB.id, pageId);
  assertEquals(getPropertyValueById(pageB.properties, propertyIdFrom("Yxvy")), {
    type: "url",
    urlType: "valid",
    url: new URL("https://narumincho.com"),
    rawUrl: "https://narumincho.com/",
  });
});
