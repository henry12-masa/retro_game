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

const reviews = { ...reviewsClassic, ...reviewsModernA, ...reviewsModernB };

export const games = [...classic, ...extraClassic, ...modern, ...extraModern]
	.map((g) => ({ ...g, body: g.body ?? reviews[g.slug] ?? "", amazonQuery: AMAZON_OVERRIDES[g.slug] ?? "" }))
	.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title, "ja"));

let keyCounter = 0;
const key = (prefix) => `${prefix}${(keyCounter++).toString(36)}`;

/** 空行区切りの本文を Portable Text のブロック配列にする */
export function bodyToPortableText(slug, body) {
	return body
		.trim()
		.split(/\n\s*\n/)
		.map((para) => para.replace(/\s*\n\s*/g, ""))
		.filter(Boolean)
		.map((text, i) => ({
			_type: "block",
			_key: `${slug}-p${i}`,
			style: "normal",
			markDefs: [],
			children: [{ _type: "span", _key: key(`${slug}-s`), text, marks: [] }],
		}));
}
