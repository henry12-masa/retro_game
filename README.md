# 遊び継ぐ

1972年の『ポン』から最新作まで、いま遊ぶ価値のあるゲームを年代・ジャンル・機種で横断するキュレーションサイト。

公開URL: https://game-curation.napoblog.com

[EmDash](https://github.com/emdash-cms/emdash)(Astro製CMS)で作り、Cloudflare Workers + D1 + R2 で動かしています。

## ページ

| ページ | パス |
|---|---|
| トップ | `/` |
| ゲーム一覧(年代・ジャンル・機種・推し度で絞り込み) | `/games` |
| 作品ページ | `/games/:slug` |
| 年表 | `/timeline` |
| 特集 | `/posts`, `/posts/:slug` |
| 検索 | `/search` |
| このサイトについて | `/pages/about` |
| プライバシーポリシー | `/privacy` |

## データ

- `data/games-classic.mjs`(〜1999年)と `data/games-modern.mjs`(2000年〜)に作品を定義
- `data/taxonomies.mjs` に年代・ジャンル・機種・推し度を定義
- `data/features.mjs` に特集記事と「このサイトについて」
- `node scripts/build-seed.mjs` で `seed/seed.json` を生成(slug重複や未定義のジャンル・機種があるとエラー)

seed は空のデータベースにだけ適用されます。公開後の作品の追加・修正は管理画面(`/_emdash/admin`)から行います。

## 開発とデプロイ

```bash
npm install
npm run dev      # http://localhost:4321
npm run deploy   # astro build && wrangler deploy(手動デプロイ)
```

`main` ブランチに push すると、Cloudflare Workers Builds が自動でビルド・デプロイします(ビルド `npm run build`、デプロイ `npx wrangler deploy`)。ブランチごとのプレビュー版は本番と同じデータベースにつながるため、無効にしています。

日本語の全文検索は trigram トークナイザが必要です。データベースを作り直したときは、管理者でログインした状態で各コレクション(games / posts / pages)に対して `POST /_emdash/api/search/enable`(`{"collection": "...", "enabled": true, "tokenize": "trigram"}`)を実行してください。
