const normalizeOrThrowUuid = <T extends string>(
  id: string,
  typeName: string,
): T => {
  if (typeof id !== "string") {
    throw new Error(`Invalid ${typeName} expected uuid string: ${id}`);
  }
  const normalized = id.replaceAll("-", "");
  if (!/^[0-9a-f]{32}$/u.test(normalized)) {
    throw new Error(`Invalid ${typeName} expected uuid string: ${id}`);
  }
  return normalized as T;
};

/**
 * ページID
 *
 * {@link pageIdFromString} で作成できる
 */
export type PageId = string & { readonly __brand: unique symbol };

/**
 * ページIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const pageIdFromString = (id: string): PageId => {
  return normalizeOrThrowUuid<PageId>(id, "PageId");
};

/**
 * ユーザーID
 *
 * {@link userIdFromString} で作成できる
 */
export type UserId = string & { readonly __brand: unique symbol };

/**
 * ユーザーIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const userIdFromString = (id: string): UserId => {
  return normalizeOrThrowUuid<UserId>(id, "UserId");
};

/**
 * データベースのプロパティのセレクトの選択肢のID
 *
 * {@link selectIdFromString} で作成できる
 */
export type SelectId = string & { readonly __brand: unique symbol };

/**
 * データベースのプロパティのセレクトの選択肢のIDを文字列から作成する
 * @throws {Error} IDとして解釈できない文字列が渡された場合
 */
export const selectIdFromString = (id: string): SelectId => {
  return normalizeOrThrowUuid<SelectId>(id, "SelectId");
};

/**
 * データベースのプロパティのID
 */
export type PropertyId = string & { readonly __brand: unique symbol };

/**
 * データベースのプロパティのセレクトの選択肢のIDを文字列から作成する
 */
export const propertyIdFromString = (id: string): PropertyId => {
  if (typeof id !== "string") {
    throw new Error(`Invalid PropertyId expected string: ${id}`);
  }
  return id as PropertyId;
};
