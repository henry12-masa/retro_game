# 全ソフト名簿の作り方

日本語版Wikipediaの「〇〇のゲームタイトル一覧」(CC BY-SA 4.0)から、日本で発売されたソフトの発売日・タイトル・発売元を取り出す。

```bash
cd scripts/catalog
node fetchhtml.mjs        # pages.json のページを html/ に保存(取得済みはスキップ)
python tables.py          # html/ の表を tables.json に
python extract.py         # 発売日・タイトル・発売元を catalog.json に
cp catalog.json ../../data/catalog/raw.json
cd ../.. && node scripts/build-catalog.mjs   # public/catalog-data/ を生成
```

- 対象機種と取得ページは pages.json。1ページに収まらない機種は年別ページも並べる。
- 複数地域の表は先頭(日本)の列だけを使う。日本で発売されていない行は捨てる。
- 非売品・体験版・発売中止・発売日未定、今日より後の発売日は除く。
