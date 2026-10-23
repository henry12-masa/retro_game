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
| 機種ガイド | `/hardware` |
| 全ソフト名簿(30機種・約4.8万本) | `/catalog`, `/catalog/:機種`, `/catalog/:機種/:年` |
| プライバシーポリシー | `/privacy` |

## データ

- 厳選作品(953本)は `data/catalog.mjs` が全ファイルを集めて作る。追加分は `games-extra*.mjs`(`data/entry.mjs` の `n()` で書き、本文は「どんなゲーム/遊びどころ/ゲーム史の中で/こんな人におすすめ」の4見出し)
- 発売年は `node scripts/check-years.mjs <ファイル>` で全ソフト名簿(日本発売日)と照合できる
- 公開中のサイトへの反映は `node scripts/sync-remote.mjs --url <サイト>`(先に `npx emdash login`)
- 全ソフト名簿の作り方は `scripts/catalog/README.md`

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
