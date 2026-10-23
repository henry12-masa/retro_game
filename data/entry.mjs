// 第2弾以降の作品データの書き方。解説本文は4つの見出しで組み立てる。
export const SECTIONS = ["どんなゲーム", "遊びどころ", "ゲーム史の中で", "こんな人におすすめ"];

export const n = (slug, title, title_en, year, developer, platforms, genres, tier, summary, note, parts) => ({
	slug,
	title,
	title_en,
	year,
	developer,
	platforms: platforms.split(" "),
	genres: genres.split(" "),
	tier,
	summary,
	note,
	body: parts.map((text, i) => `## ${SECTIONS[i]}\n${text}`).join("\n\n"),
});
