import { HARDWARE } from "../../data/hardware.mjs";

/** Amazonアソシエイトのトラッキングid */
export const AMAZON_TAG = "hitomi0303-22";

export function amazonSearchUrl(query: string) {
	return `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

/**
 * ソフトのリンクに使う機種の優先順(手に入れやすい順)。
 * アーケード・PC・スマホ・VRなど、Amazonでパッケージを扱わない機種は含めない。
 */
const SOFT_PLATFORMS: Array<[string, string]> = [
	["switch", "Switch"],
	["switch2", "Switch 2"],
	["ps5", "PS5"],
	["ps4", "PS4"],
	["xsx", "Xbox Series X"],
	["xone", "Xbox One"],
	["3ds", "3DS"],
	["wiiu", "Wii U"],
	["ds", "DS"],
	["wii", "Wii"],
	["vita", "PS Vita"],
	["psp", "PSP"],
	["ps3", "PS3"],
	["x360", "Xbox 360"],
	["gc", "ゲームキューブ"],
	["ps2", "PS2"],
	["xbox", "Xbox"],
	["gba", "ゲームボーイアドバンス"],
	["dc", "ドリームキャスト"],
	["saturn", "セガサターン"],
	["ps1", "PlayStation"],
	["n64", "NINTENDO64"],
	["gb", "ゲームボーイ"],
	["sfc", "スーパーファミコン"],
	["md", "メガドライブ"],
	["pce", "PCエンジン"],
	["neogeo", "ネオジオ"],
	["fc", "ファミコン"],
	["fds", "ディスクシステム"],
	["msx", "MSX"],
	["sms", "セガ マークIII"],
	["atari2600", "Atari 2600"],
];

export interface AmazonLink {
	label: string;
	url: string;
}

/**
 * 作品のAmazonリンク。管理画面の amazon_query が "none" ならリンクなし、
 * 入力があればそれを検索語にする。空なら「タイトル+機種」で検索する。
 */
export function amazonForGame(game: {
	title: string;
	platforms: Array<{ slug: string; label: string }>;
	amazonQuery?: string;
}): AmazonLink | null {
	const override = game.amazonQuery?.trim();
	if (override === "none") return null;
	if (override) return { label: `「${override}」をAmazonで探す`, url: amazonSearchUrl(override) };

	const slugs = new Set(game.platforms.map((p) => p.slug));
	const hit = SOFT_PLATFORMS.find(([slug]) => slugs.has(slug));
	if (!hit) return null;
	const query = `${game.title} ${hit[1]}`;
	return { label: `${hit[1]}版をAmazonで探す`, url: amazonSearchUrl(query) };
}

export interface HardwareInfo {
	slug: string;
	maker: string;
	year: number | null;
	gen: string;
	note?: string;
	desc: string;
	amazon: AmazonLink | null;
}

export function hardwareInfo(slug: string): HardwareInfo | null {
	const h = (HARDWARE as Record<string, any>)[slug];
	if (!h) return null;
	return {
		slug,
		maker: h.maker,
		year: h.year,
		gen: h.gen,
		note: h.note,
		desc: h.desc,
		amazon: h.amazon ? { label: h.amazon.label, url: amazonSearchUrl(h.amazon.query) } : null,
	};
}

/** 全ソフト名簿の1行のAmazon検索リンク(パッケージ版のある機種のみ) */
export function amazonCatalogUrl(title: string, platform: string): string | null {
	const label = platform === "gbc" ? "ゲームボーイカラー" : SOFT_PLATFORMS.find(([slug]) => slug === platform)?.[1];
	if (!label) return null;
	return amazonSearchUrl(`${title} ${label}`);
}
