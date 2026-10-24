// 全作品をひとつの配列にまとめ、解説本文(body)を付ける。
// seed生成(scripts/build-seed.mjs)と本番への同期(scripts/sync-remote.mjs)の両方がここを読む。
import classic from "./games-classic.mjs";
import modern from "./games-modern.mjs";
import extraClassic from "./games-extra-classic.mjs";
import extraModern from "./games-extra-modern.mjs";
import reviewsClassic from "./reviews-classic.mjs";
import reviewsModernA from "./reviews-modern-a.mjs";
import reviewsModernB from "./reviews-modern-b.mjs";
import { AMAZON_OVERRIDES } from "./amazon-overrides.mjs";
import { SECTIONS } from "./entry.mjs";
import rx1 from "./reviews-extra-1.mjs";
import rx2 from "./reviews-extra-2.mjs";
import rx3 from "./reviews-extra-3.mjs";
import rx4 from "./reviews-extra-4.mjs";
import x20 from "./games-extra2-fc.mjs";
import x21 from "./games-extra2-sfc.mjs";
import x22 from "./games-extra2-16bit.mjs";
import x23 from "./games-extra2-handheld1.mjs";
import x24 from "./games-extra2-32bit.mjs";
import x25 from "./games-extra2-128bit.mjs";
import x26 from "./games-extra2-handheld2.mjs";
import x27 from "./games-extra2-hd.mjs";
import x28 from "./games-extra2-current.mjs";
import x3r from "./games-extra3-retro.mjs";
import x3a from "./games-extra3-a.mjs";
import x3b from "./games-extra3-b.mjs";
import updates from "./games-updates.mjs";

const reviews = { ...reviewsClassic, ...reviewsModernA, ...reviewsModernB };
const reviewExtras = { ...rx1, ...rx2, ...rx3, ...rx4 };

/** 2段落の旧形式の本文に、遊びどころ・おすすめを足して4つの見出しにそろえる */
function withSections(slug, body) {
	if (!body || body.startsWith("## ")) return body;
	const [about = "", history = ""] = body.trim().split(/\n\s*\n/);
	const [play, forWho] = reviewExtras[slug] ?? [];
	// 旧形式の2段落目は遊び方と位置づけが混ざっているので「見どころ」と呼ぶ
	const headings = [SECTIONS[0], "見どころ", SECTIONS[1], SECTIONS[3]];
	return [about, history, play, forWho]
		.map((text, i) => (text ? `## ${headings[i]}\n${text}` : ""))
		.filter(Boolean)
		.join("\n\n");
}

export const games = [
	...classic,
	...extraClassic,
	...modern,
	...extraModern,
	...x20,
	...x21,
	...x22,
	...x23,
	...x24,
	...x25,
	...x26,
	...x27,
	...x28,
	...x3r,
	...x3a,
	...x3b,
	...updates,
]
	.map((g) => ({
		...g,
		body: withSections(g.slug, g.body ?? reviews[g.slug] ?? ""),
		amazonQuery: AMAZON_OVERRIDES[g.slug] ?? "",
	}))
	.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title, "ja"));

let keyCounter = 0;
const key = (prefix) => `${prefix}${(keyCounter++).toString(36)}`;

/** 本文を Portable Text のブロック配列にする。「## 」で始まる行は小見出し(h3)、空行で段落を区切る */
export function bodyToPortableText(slug, body) {
	const blocks = [];
	for (const chunk of body.trim().split(/\n\s*\n/)) {
		const para = [];
		for (const line of chunk.split("\n")) {
			if (line.startsWith("## ")) blocks.push({ style: "h3", text: line.slice(3).trim() });
			else para.push(line.trim());
		}
		if (para.join("")) blocks.push({ style: "normal", text: para.join("") });
	}
	return blocks.map((b, i) => ({
		_type: "block",
		_key: `${slug}-b${i}`,
		style: b.style,
		markDefs: [],
		children: [{ _type: "span", _key: key(`${slug}-s`), text: b.text, marks: [] }],
	}));
}
