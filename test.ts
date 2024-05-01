import {
  pageIdFrom,
  type PropertyId,
  propertyIdFrom,
  type PropertyValue,
  queryDatabase,
  selectIdFrom,
  userIdFrom,
} from "./mod.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import secret from "./secret.json" with { type: "json" };
import { databaseIdFrom } from "./id.ts";

const { apiKey } = secret;

Deno.test("queryDatabase one", async () => {
  const firstPage = await queryDatabase({
    apiKey,
    databaseId: databaseIdFrom("a1cb2e5ca6f94399a835fdcd39a828cb"),
  }).next();
  if (firstPage.done) {
    throw new Error("No page found");
  }
  assertEquals(
    firstPage.value.id,
    pageIdFrom("e3389b1b7e7841c9835155b8f4757dbe"),
  );
  assertEquals(
    firstPage.value.createdByUserId,
    userIdFrom("b98a5d4e7d88422b8e58dcf58d45b7f0"),
  );
  assertEquals(
    firstPage.value.createdTime,
    new Date("2024-04-27T12:18:00.000Z"),
  );
  assertEquals(firstPage.value.inTrash, false);
  assertEquals(
    firstPage.value.properties,
    new Map<PropertyId, {
      readonly name: string;
      readonly value: PropertyValue;
    }>([
      [
        propertyIdFrom("title"),
        {
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
      ],
      [
        propertyIdFrom("ycLe"),
        {
          name: "タグ",
          value: {
            type: "select",
            select: [
              {
                id: selectIdFrom("392f963c2cc44009a24121b704c04042"),
                name: "A",
                color: "green",
              },
            ],
            selectType: "multiSelect",
          },
        },
      ],
      [
        propertyIdFrom("BjF%5D"),
        {
          name: "日付",
          value: {
            type: "date",
            date: {
              start: new Date("2024-04-29T03:00:00.000Z"),
              end: undefined,
            },
          },
        },
      ],
      [
        propertyIdFrom("ZX%3CB"),
        {
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
      ],
    ]),
  );
});

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
