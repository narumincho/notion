const normalizeOrThrowUuid = <T extends string>(
  id: string,
  typeName: string,
): T => {
  if (typeof id !== "string") {
    throw new Error(`Invalid ${typeName} expected uuid string: ${id}`);
  }
  const normalized = id.replaceAll("-", "").trim();
  if (!/^[0-9a-f]{32}$/u.test(normalized)) {
    throw new Error(`Invalid ${typeName} expected uuid string: ${id}`);
  }
  return normalized as T;
};

/**
 * コメントID. 作成時に`-`が除去されている
 *
 * {@link commentIdFrom} で作成できる
 */
export type CommentId = string & { readonly __brand: unique symbol };

/**
 * コメントIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const commentIdFrom = (id: string): CommentId => {
  return normalizeOrThrowUuid<CommentId>(id, "CommentId");
};

/**
 * ブロックID. 作成時に`-`が除去されている
 *
 * {@link blockIdFrom} で作成できる
 */
export type BlockId = string & { readonly __brand: unique symbol };

/**
 * ブロックIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const blockIdFrom = (id: string): BlockId => {
  return normalizeOrThrowUuid<BlockId>(id, "BlockId");
};

/**
 * ページID. 作成時に`-`が除去されている
 *
 * {@link pageIdFrom} で作成できる
 */
export type PageId = string & { readonly __brand: unique symbol };

/**
 * ページIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const pageIdFrom = (id: string): PageId => {
  return normalizeOrThrowUuid<PageId>(id, "PageId");
};

/**
 * データベースID. 作成時に`-`が除去されている
 *
 * {@link databaseIdFrom} で作成できる
 */
export type DatabaseId = string & { readonly __brand: unique symbol };

/**
 * データベースIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const databaseIdFrom = (id: string): DatabaseId => {
  return normalizeOrThrowUuid<DatabaseId>(id, "DatabaseId");
};

/**
 * ユーザーID. 作成時に`-`が除去されている
 *
 * {@link userIdFrom} で作成できる
 */
export type UserId = string & { readonly __brand: unique symbol };

/**
 * ユーザーIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const userIdFrom = (id: string): UserId => {
  return normalizeOrThrowUuid<UserId>(id, "UserId");
};

/**
 * データベースのプロパティのセレクトの選択肢のID. 作成時に`-`が除去されている
 *
 * {@link selectIdFrom} で作成できる
 */
export type SelectId = string & { readonly __brand: unique symbol };

/**
 * データベースのプロパティのセレクトの選択肢のIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const selectIdFrom = (id: string): SelectId => {
  return normalizeOrThrowUuid<SelectId>(id, "SelectId");
};

/**
 * データベースのプロパティのID
 */
export type PropertyId = string & { readonly __brand: unique symbol };

/**
 * データベースのプロパティのセレクトの選択肢のIDを文字列から作成する
 */
export const propertyIdFrom = (id: string): PropertyId => {
  if (typeof id !== "string") {
    throw new Error(`Invalid PropertyId expected string: ${id}`);
  }
  return id as PropertyId;
};
