// data/ 以下のゲームデータと特集記事から seed/seed.json を生成する。
// 使い方: node scripts/build-seed.mjs
// seed は「空のデータベース」にだけ適用される。作り直すときは data.db を消してから dev を起動する。
import { writeFileSync } from "node:fs";
import { ERAS, GENRES, PLATFORMS, TIERS, eraForYear } from "../data/taxonomies.mjs";
import { games, bodyToPortableText } from "../data/catalog.mjs";
import { features, aboutPage } from "../data/features.mjs";


// ---- 検証: slug重複・未定義のジャンル/機種・年代の判定漏れ
const seen = new Set();
for (const game of games) {
	if (seen.has(game.slug)) throw new Error(`slug重複: ${game.slug}`);
	seen.add(game.slug);
	for (const g of game.genres) if (!GENRES[g]) throw new Error(`${game.slug}: 未定義のジャンル ${g}`);
	for (const p of game.platforms) if (!PLATFORMS[p]) throw new Error(`${game.slug}: 未定義の機種 ${p}`);
	if (!TIERS[game.tier]) throw new Error(`${game.slug}: 未定義の推し度 ${game.tier}`);
	if (!eraForYear(game.year)) throw new Error(`${game.slug}: 年代が判定できない ${game.year}`);
	if (!game.body) throw new Error(`${game.slug}: 解説本文がない`);
}
for (const f of features) {
	for (const slug of f.mentions ?? []) if (!seen.has(slug)) throw new Error(`特集 ${f.slug}: 存在しないゲーム ${slug}`);
}

const terms = (obj) => Object.entries(obj).map(([slug, label]) => ({ slug, label }));

const seed = {
	$schema: "https://emdashcms.com/seed.schema.json",
	version: "1",
	meta: {
		name: "遊び継ぐ",
		description: "レトロから新作まで、年代・ジャンル・機種で横断するゲームキュレーションサイト",
		author: "遊び継ぐ編集部",
	},
	settings: {
		title: "遊び継ぐ",
		tagline: "1972年の『ポン』から最新作まで。いま遊ぶ価値のあるゲームを、年代・ジャンル・機種で横断するキュレーションサイト。",
	},
	collections: [
		{
			slug: "games",
			label: "ゲーム",
			labelSingular: "ゲーム",
			urlPattern: "/games/{slug}",
			supports: ["drafts", "revisions", "search", "seo"],
			fields: [
				{ slug: "title", label: "タイトル", type: "string", required: true, searchable: true },
				{ slug: "title_en", label: "英語タイトル", type: "string", searchable: true },
				{ slug: "release_year", label: "初出年", type: "integer", required: true },
				{ slug: "developer", label: "開発", type: "string", searchable: true },
				{
					slug: "tier", label: "推し度", type: "select", required: true,
					validation: { options: Object.keys(TIERS) },
				},
				{ slug: "summary", label: "ひとこと紹介", type: "text", searchable: true },
				{ slug: "curator_note", label: "キュレーターの一言", type: "text", searchable: true },
				{ slug: "cover", label: "カバー画像", type: "image" },
				{ slug: "content", label: "レビュー本文", type: "portableText", searchable: true },
				{ slug: "official_url", label: "公式サイト", type: "url" },
				{ slug: "amazon_query", label: "Amazon検索語(空なら自動、none でリンクなし)", type: "string" },
			],
		},
		{
			slug: "posts",
			label: "特集",
			labelSingular: "特集",
			urlPattern: "/posts/{slug}",
			supports: ["drafts", "revisions", "preview", "scheduling", "search", "seo"],
			fields: [
				{ slug: "title", label: "タイトル", type: "string", required: true, searchable: true },
				{ slug: "featured_image", label: "アイキャッチ", type: "image" },
				{ slug: "content", label: "本文", type: "portableText", searchable: true },
				{ slug: "excerpt", label: "抜粋", type: "text" },
			],
		},
		{
			slug: "pages",
			label: "固定ページ",
			labelSingular: "固定ページ",
			urlPattern: "/pages/{slug}",
			supports: ["drafts", "revisions", "preview", "search", "seo"],
			fields: [
				{ slug: "title", label: "タイトル", type: "string", required: true, searchable: true },
				{ slug: "content", label: "本文", type: "portableText", searchable: true },
			],
		},
	],
	taxonomies: [
		{
			name: "era", label: "年代", labelSingular: "年代", hierarchical: false, collections: ["games"],
			terms: ERAS.map((e) => ({ slug: e.slug, label: e.label })),
		},
		{
			name: "genre", label: "ジャンル", labelSingular: "ジャンル", hierarchical: false, collections: ["games"],
			terms: terms(GENRES),
		},
		{
			name: "platform", label: "機種", labelSingular: "機種", hierarchical: false, collections: ["games"],
			terms: terms(PLATFORMS),
		},
		{
			name: "category", label: "特集カテゴリ", labelSingular: "特集カテゴリ", hierarchical: true, collections: ["posts"],
			terms: [
				{ slug: "guide", label: "入門ガイド" },
				{ slug: "history", label: "系譜を読む" },
				{ slug: "review", label: "年間ベスト" },
			],
		},
		{
			name: "tag", label: "タグ", labelSingular: "タグ", hierarchical: false, collections: ["posts"],
			terms: [
				{ slug: "retro", label: "レトロ" },
				{ slug: "indie", label: "インディー" },
				{ slug: "new", label: "新作" },
				{ slug: "beginner", label: "はじめての人へ" },
			],
		},
	],
	bylines: [{ id: "byline-editorial", slug: "editorial", displayName: "遊び継ぐ編集部" }],
	menus: [
		{
			name: "primary",
			label: "メインメニュー",
			items: [
				{ type: "custom", label: "ゲーム一覧", url: "/games" },
				{ type: "custom", label: "年表", url: "/timeline" },
				{ type: "custom", label: "機種ガイド", url: "/hardware" },
				{ type: "custom", label: "特集", url: "/posts" },
				{ type: "custom", label: "このサイトについて", url: "/pages/about" },
			],
		},
	],
	widgetAreas: [
		{
			name: "sidebar",
			label: "サイドバー",
			description: "特集記事ページに表示",
			widgets: [
				{ type: "component", componentId: "core:search", title: "検索" },
				{ type: "component", componentId: "core:categories", title: "特集カテゴリ" },
				{ type: "component", componentId: "core:recent-posts", title: "新しい特集", props: { count: 5, showDate: false } },
			],
		},
		{
			name: "footer",
			label: "フッター",
			description: "フッターに表示",
			widgets: [
				{
					type: "content",
					title: "編集方針",
					content: [
						{
							_type: "block", _key: "f0", style: "normal",
							children: [{
								_type: "span", _key: "f1",
								text: "点数はつけません。いま遊ぶ理由をひとことで添えて、年代・ジャンル・機種のどこからでも次の1本に出会えるようにしています。",
							}],
						},
					],
				},
			],
		},
	],
	content: {
		games: games.map((game) => ({
			id: `game-${game.slug}`,
			slug: game.slug,
			status: "published",
			data: {
				title: game.title,
				title_en: game.title_en,
				release_year: game.year,
				developer: game.developer,
				tier: game.tier,
				summary: game.summary,
				curator_note: game.note,
				content: bodyToPortableText(game.slug, game.body),
				amazon_query: game.amazonQuery,
			},
			taxonomies: {
				era: [eraForYear(game.year).slug],
				genre: game.genres,
				platform: game.platforms,
			},
		})),
		posts: features.map((f) => ({
			id: `post-${f.slug}`,
			slug: f.slug,
			status: "published",
			data: { title: f.title, excerpt: f.excerpt, content: f.content },
			bylines: [{ byline: "byline-editorial" }],
			taxonomies: { category: [f.category], tag: f.tags },
		})),
		pages: [aboutPage],
	},
};

writeFileSync(new URL("../seed/seed.json", import.meta.url), JSON.stringify(seed, null, "\t") + "\n");

const byEra = ERAS.map((e) => `${e.short}:${games.filter((g) => eraForYear(g.year) === e).length}`);
console.log(`seed/seed.json を生成: ゲーム${games.length}本 / 特集${features.length}本`);
console.log(byEra.join("  "));
