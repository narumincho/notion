import {
  pageIdFromString,
  type PropertyId,
  propertyIdFromString,
  type PropertyValue,
  queryDatabase,
  selectIdFromString,
  userIdFromString,
} from "./mod.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import secret from "./secret.json" with { type: "json" };

const { apiKey } = secret;

Deno.test("queryDatabase one", async () => {
  const firstPage = await queryDatabase({
    apiKey,
    databaseId: pageIdFromString("a1cb2e5ca6f94399a835fdcd39a828cb"),
  }).next();
  if (firstPage.done) {
    throw new Error("No page found");
  }
  assertEquals(
    firstPage.value.id,
    pageIdFromString("e3389b1b7e7841c9835155b8f4757dbe"),
  );
  assertEquals(
    firstPage.value.createdByUserId,
    userIdFromString("b98a5d4e7d88422b8e58dcf58d45b7f0"),
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
        propertyIdFromString("title"),
        {
          name: "名前",
          value: {
            type: "unsupported",
          },
        },
      ],
      [
        propertyIdFromString("ycLe"),
        {
          name: "タグ",
          value: {
            type: "select",
            select: [
              {
                id: selectIdFromString("392f963c2cc44009a24121b704c04042"),
                name: "A",
                color: "green",
              },
            ],
            selectType: "multi_select",
          },
        },
      ],
      [
        propertyIdFromString("BjF%5D"),
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
        propertyIdFromString("ZX%3CB"),
        {
          name: "ステータス",
          value: {
            type: "select",
            select: [
              {
                id: selectIdFromString("adde31eb4432411d846c43059dad2f58"),
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
          databaseId: pageIdFromString("f0c37c083b574327a1bf65bea3130dd6"),
        })
      ) {
        console.log(page);
      }
    },
    Error,
    "object_not_found",
  );
});
