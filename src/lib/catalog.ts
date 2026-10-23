import { env } from "cloudflare:workers";

/** 全ソフト名簿の1行: [発売日, タイトル, 発売元, ダウンロード専売なら1, 厳選作品のslug] */
export type CatalogRow = [string, string, string, number, string?];

export interface CatalogPlatform {
	slug: string;
	label: string;
	count: number;
	dl: number;
	years: Array<[number, number]>;
}

export interface CatalogIndex {
	updated: string;
	total: number;
	platforms: CatalogPlatform[];
}

/** public/catalog-data/ のJSONを、Workerのバンドルに含めずに静的アセットから読む */
async function readAsset<T>(path: string, origin: string): Promise<T | null> {
	const assets = (env as unknown as { ASSETS?: { fetch: (r: Request) => Promise<Response> } }).ASSETS;
	const url = new URL(`/catalog-data/${path}`, origin);
	const res = assets ? await assets.fetch(new Request(url)) : await fetch(url);
	if (!res.ok) return null;
	return (await res.json()) as T;
}

export function loadCatalogIndex(origin: string) {
	return readAsset<CatalogIndex>("index.json", origin);
}

export function loadCatalogYear(platform: string, year: number, origin: string) {
	return readAsset<CatalogRow[]>(`${platform}/${year}.json`, origin);
}

/** 「1985-09-13」→「9月13日」、月だけ・年だけの日付にも対応 */
export function formatCatalogDate(d: string) {
	const [, m, day] = d.split("-");
	if (day) return `${Number(m)}月${Number(day)}日`;
	if (m) return `${Number(m)}月`;
	return "時期不明";
}

/** 検索用: 全角半角・大文字小文字・空白の違いを無視して比べる */
export function normalizeForSearch(s: string) {
	return s.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
}
