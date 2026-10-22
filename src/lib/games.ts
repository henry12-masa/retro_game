import { getAllTermsForEntries, getEmDashCollection } from "emdash";
import { ERAS, GENRES, PLATFORMS, TIERS } from "../../data/taxonomies.mjs";

export { ERAS, GENRES, PLATFORMS, TIERS };

export type Tier = keyof typeof TIERS;
export type Era = (typeof ERAS)[number];

export interface Term {
	slug: string;
	label: string;
}

export interface Game {
	slug: string;
	id: string;
	title: string;
	titleEn: string;
	year: number;
	developer: string;
	tier: Tier;
	summary: string;
	note: string;
	cover: unknown;
	content: unknown;
	officialUrl: string;
	era: Term | null;
	genres: Term[];
	platforms: Term[];
}

const TIER_ORDER: Record<string, number> = { essential: 0, recommended: 1, deep: 2 };

/**
 * 公開中のゲームをすべて読み込み、年代・ジャンル・機種のタームを付けて返す。
 * 掲載数は数百本規模なので、絞り込みと並べ替えはサーバー側のJSで行う。
 */
export async function loadGames() {
	const { entries, error, cacheHint } = await getEmDashCollection("games", {
		limit: 1000,
		orderBy: { release_year: "asc" },
	});
	if (error) throw error;

	const termsByEntry = await getAllTermsForEntries(
		"games",
		entries.map((e) => e.data.id),
	);
	const pick = (t: { slug: string; label: string }) => ({ slug: t.slug, label: t.label });

	const games: Game[] = entries.map((entry) => {
		const d = entry.data as Record<string, any>;
		const terms = termsByEntry.get(d.id) ?? {};
		return {
			slug: entry.id,
			id: d.id,
			title: d.title ?? "",
			titleEn: d.title_en ?? "",
			year: Number(d.release_year) || 0,
			developer: d.developer ?? "",
			tier: (d.tier ?? "recommended") as Tier,
			summary: d.summary ?? "",
			note: d.curator_note ?? "",
			cover: d.cover ?? null,
			content: d.content ?? null,
			officialUrl: d.official_url ?? "",
			era: terms.era?.[0] ? pick(terms.era[0]) : null,
			genres: (terms.genre ?? []).map(pick),
			platforms: (terms.platform ?? []).map(pick),
		};
	});

	games.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title, "ja"));
	return { games, cacheHint };
}

export type SortKey = "old" | "new" | "tier" | "title";

export function sortGames(games: Game[], sort: SortKey) {
	const list = [...games];
	switch (sort) {
		case "new":
			return list.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, "ja"));
		case "tier":
			return list.sort(
				(a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.year - b.year,
			);
		case "title":
			return list.sort((a, b) => a.title.localeCompare(b.title, "ja"));
		default:
			return list.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title, "ja"));
	}
}

export function eraBySlug(slug: string | null | undefined) {
	return ERAS.find((e) => e.slug === slug) ?? null;
}

/** 一覧ページの絞り込みURLを作る */
export function gamesUrl(params: Record<string, string | undefined>) {
	const search = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) if (v) search.set(k, v);
	const qs = search.toString();
	return qs ? `/games?${qs}` : "/games";
}

/** 同じジャンルを持つ他の年代の作品(系譜をたどる用) */
export function relatedGames(game: Game, all: Game[], limit = 6) {
	const genreSlugs = new Set(game.genres.map((g) => g.slug));
	return all
		.filter((g) => g.slug !== game.slug)
		.map((g) => ({
			game: g,
			shared: g.genres.filter((x) => genreSlugs.has(x.slug)).length,
		}))
		.filter((x) => x.shared > 0)
		.sort(
			(a, b) =>
				b.shared - a.shared ||
				TIER_ORDER[a.game.tier] - TIER_ORDER[b.game.tier] ||
				Math.abs(a.game.year - game.year) - Math.abs(b.game.year - game.year),
		)
		.slice(0, limit)
		.map((x) => x.game)
		.sort((a, b) => a.year - b.year);
}
