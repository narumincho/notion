# @narumincho/notion

https://github.com/makenotion/notion-sdk-js より自分に必要な機能に絞った Notion API を呼ぶためのライブラリ

JSR: https://jsr.io/@narumincho/notion

Deno を使ってます

## 目指していきたい目標

- 公式SDK では なぜか Parial が返ってくる仕様になっており, いちいち分岐する必要があるし, その仕様が分かりずらい
- 公式SDK では ページ作成のオブジェクトが深くなり, 型エラーが発生したときにどこを直せばよくなるか分かり辛い
- 少ない依存ライブラリ (現状 0)
- Tree Shaking ができるように
- ページング対応がすぐできるように AsyncIterator とか対応済みのものが欲しい
- ページのタイトル文字列を簡単に取り出せるように
- 公式SDKはコード生成しているのか, ドキュメンテーションコメントがないのが不満
