import { notionIdFromString, queryDatabase } from "./mod.ts";
import { assertEquals, assertRejects } from "jsr:@std/assert";
import secret from "./secret.json" with { type: "json" };

const { apiKey } = secret;

Deno.test("queryDatabase one", async () => {
  const firstPage = await queryDatabase({
    apiKey,
    databaseId: notionIdFromString("a1cb2e5ca6f94399a835fdcd39a828cb"),
  }).values().next();
  assertEquals(firstPage.value, {
    id: notionIdFromString("e3389b1b7e7841c9835155b8f4757dbe"),
  });
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
