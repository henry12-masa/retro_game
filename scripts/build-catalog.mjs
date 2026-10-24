// data/catalog/raw.json(全ソフト名簿)を、サイトが読む形に分割して public/catalog-data/ に書き出す。
//   public/catalog-data/index.json        機種ごとの本数と年ごとの本数
//   public/catalog-data/<機種>/<年>.json  その年の発売ソフト [[発売日, タイトル, 発売元, フラグ, 厳選slug], ...]
// 厳選作品(data/catalog.mjs)とタイトルが一致するものには、作品ページへのリンク用に slug を付ける。
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { games } from "../data/catalog.mjs";

const read = (name) => JSON.parse(readFileSync(new URL(`../data/catalog/${name}`, import.meta.url), "utf8"));
// additions.json は、ウィキペディアから取った後に出た新作などを手で足す分({機種: [{t, d, p, dl}]} の形)
const raw = read("raw.json");
for (const [pf, list] of Object.entries(read("additions.json"))) raw[pf] = [...(raw[pf] ?? []), ...list];
// 名簿の更新日(日本時間)
const TODAY = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const OUT = new URL("../public/catalog-data/", import.meta.url);

// 機種の表示名と並び順(発売順)
export const CATALOG_PLATFORMS = [
	["fc", "ファミリーコンピュータ"],
	["fds", "ディスクシステム"],
	["pce", "PCエンジン"],
	["md", "メガドライブ"],
	["gb", "ゲームボーイ"],
	["sfc", "スーパーファミコン"],
	["neogeo", "ネオジオ"],
	["ps1", "PlayStation"],
	["saturn", "セガサターン"],
	["n64", "NINTENDO64"],
	["gbc", "ゲームボーイカラー"],
	["dc", "ドリームキャスト"],
	["ps2", "PlayStation 2"],
	["gba", "ゲームボーイアドバンス"],
	["gc", "ゲームキューブ"],
	["xbox", "Xbox"],
	["ds", "ニンテンドーDS"],
	["psp", "PSP"],
	["x360", "Xbox 360"],
	["ps3", "PlayStation 3"],
	["wii", "Wii"],
	["3ds", "ニンテンドー3DS"],
	["vita", "PS Vita"],
	["wiiu", "Wii U"],
	["ps4", "PlayStation 4"],
	["xone", "Xbox One"],
	["switch", "Nintendo Switch"],
	["ps5", "PlayStation 5"],
	["xsx", "Xbox Series X|S"],
	["switch2", "Nintendo Switch 2"],
];

/** 表記ゆれを吸収した比較用のキー */
function norm(title) {
	return title
		.normalize("NFKC")
		.toLowerCase()
		.replace(/[\s・:：\-－―‐~〜!！?？'’"“”「」『』()（）\[\]【】.,、。&＆/]/g, "")
		.replace(/ⅱ/g, "ii")
		.replace(/ⅲ/g, "iii");
}

// 厳選作品の索引(日本語名と英語名の両方で引く)。カタログの gbc は厳選側では gb として扱う。
const curated = new Map();
for (const g of games) {
	for (const t of [g.title, g.title_en]) {
		if (!t) continue;
		const key = norm(t);
		if (key.length < 2) continue;
		if (!curated.has(key)) curated.set(key, []);
		curated.get(key).push(g);
	}
}
const samePlatform = (pf, g) => g.platforms.includes(pf) || (pf === "gbc" && g.platforms.includes("gb"));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const index = [];
let linked = 0;
let total = 0;
for (const [pf, label] of CATALOG_PLATFORMS) {
	const list = raw[pf] ?? [];
	const byYear = new Map();
	for (const e of list) {
		const year = e.d.slice(0, 4);
		const hits = curated.get(norm(e.t)) ?? [];
		const hit = hits.find((g) => samePlatform(pf, g)) ?? null;
		if (hit) linked++;
		const row = [e.d, e.t, e.p, e.dl ? 1 : 0];
		if (hit) row.push(hit.slug);
		if (!byYear.has(year)) byYear.set(year, []);
		byYear.get(year).push(row);
	}
	mkdirSync(new URL(`${pf}/`, OUT), { recursive: true });
	const years = [];
	for (const [year, rows] of [...byYear].sort()) {
		writeFileSync(new URL(`${pf}/${year}.json`, OUT), JSON.stringify(rows));
		years.push([Number(year), rows.length]);
	}
	total += list.length;
	index.push({ slug: pf, label, count: list.length, dl: list.filter((e) => e.dl).length, years });
}
writeFileSync(new URL("index.json", OUT), JSON.stringify({ updated: TODAY, total, platforms: index }));
console.log(`全ソフト名簿: ${total}本 / ${index.length}機種(厳選作品へのリンク ${linked}件)`);
