import {
  notionIdFromString,
  notionUserIdFromString,
  PropertyValue,
  queryDatabase,
} from "./mod.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import secret from "./secret.json" with { type: "json" };

const { apiKey } = secret;

Deno.test("queryDatabase one", async () => {
  const firstPage = await queryDatabase({
    apiKey,
    databaseId: notionIdFromString("a1cb2e5ca6f94399a835fdcd39a828cb"),
  }).next();
  if (firstPage.done) {
    throw new Error("No page found");
  }
  assertEquals(
    firstPage.value.id,
    notionIdFromString("e3389b1b7e7841c9835155b8f4757dbe"),
  );
  assertEquals(
    firstPage.value.createdByUserId,
    notionUserIdFromString("b98a5d4e7d88422b8e58dcf58d45b7f0"),
  );
  assertEquals(
    firstPage.value.createdTime,
    new Date("2024-04-27T12:18:00.000Z"),
  );
  assertEquals(firstPage.value.inTrash, false);
  assertEquals(
    firstPage.value.properties,
    new Map<string, {
      readonly name: string;
      readonly value: PropertyValue;
    }>([
      [
        "title",
        {
          name: "名前",
          value: {
            type: "unsupported",
          },
        },
      ],
      [
        "ycLe",
        {
          name: "タグ",
          value: {
            type: "unsupported",
          },
        },
      ],
      [
        "BjF%5D",
        {
          name: "日付",
          value: {
            type: "unsupported",
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
          databaseId: notionIdFromString("f0c37c083b574327a1bf65bea3130dd6"),
        })
      ) {
        console.log(page);
      }
    },
    Error,
    "object_not_found",
  );
});
