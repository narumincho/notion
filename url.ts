/**
 * NotionのAPIのレスポンスで相対URLが返ってくることがあるので, それを絶対URLに変換する
 * @param url
 */
export function createUrl(url: string): URL {
  try {
    return new URL(url);
  } catch {
    try {
      return new URL(url, "https://notion.so");
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }
  }
}
