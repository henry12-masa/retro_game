// 作品データの発売年・タイトルを、全ソフト名簿(data/catalog/raw.json、日本発売分)と照合する。
// 使い方: node scripts/check-years.mjs data/games-extra2-fc.mjs [...]
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const read = (name) => JSON.parse(readFileSync(new URL(`../data/catalog/${name}`, import.meta.url), "utf8"));
const raw = read("raw.json");
for (const [pf, list] of Object.entries(read("additions.json"))) raw[pf] = [...(raw[pf] ?? []), ...list];
const norm = (t) => t.normalize("NFKC").toLowerCase().replace(/[\s・:：\-－―‐~〜!！?？'’"「」『』()（）\[\]【】.,、。&＆/]/g, "");
const index = new Map();
for (const [pf, list] of Object.entries(raw)) for (const e of list) {
	const k = norm(e.t);
	if (!index.has(k)) index.set(k, []);
	index.get(k).push({ pf: pf === "gbc" ? "gb" : pf, d: e.d, t: e.t });
}
let bad = 0, miss = 0, ok = 0;
for (const file of process.argv.slice(2)) {
	const list = (await import(pathToFileURL(resolve(file)).href)).default;
	for (const g of list) {
		const hits = (index.get(norm(g.title)) ?? []).filter((h) => g.platforms.includes(h.pf));
		// 部分一致(副題の違い)も拾う
		const loose = hits.length ? hits : [...index.entries()].filter(([k]) => k.startsWith(norm(g.title)) || norm(g.title).startsWith(k) && k.length >= 4).flatMap(([, v]) => v).filter((h) => g.platforms.includes(h.pf));
		const home = g.platforms.filter((p) => !["pc", "arcade", "mobile", "vr", "msx", "pc88", "atari2600", "sms"].includes(p));
		if (!loose.length) {
			if (home.length) { miss++; console.log(`?? ${g.slug} 「${g.title}」${g.year} 名簿に見つからない (${home.join(",")})`); }
			continue;
		}
		const first = Math.min(...loose.map((h) => Number(h.d.slice(0, 4))));
		if (first < g.year || (!g.platforms.some((p) => ["pc", "arcade", "msx", "pc88"].includes(p)) && first !== g.year)) {
			bad++; console.log(`NG ${g.slug} 「${g.title}」掲載${g.year} / 名簿の最古${first} ${loose.slice(0, 3).map((h) => `${h.pf}:${h.d}:${h.t}`).join(" | ")}`);
		} else ok++;
	}
}
console.log(`一致 ${ok} / 年が違う ${bad} / 名簿で見つからない ${miss}`);
