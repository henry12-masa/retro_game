// 機種ガイドのデータ。slug は taxonomies.mjs の PLATFORMS と対応する。
// year は日本での発売年(日本未発売・地域差があるものは note に記載)。
// amazon: Amazonで探すときの検索語。null は「Amazonで扱う本体がない」もの。
// 生産終了機は中古・互換機・復刻ミニ機が中心になるため、復刻機があればそれを優先して案内する。

export const HARDWARE = {
	arcade: {
		maker: "各社", year: null, gen: "業務用",
		desc: "ゲームセンターに置かれる業務用機。家庭用より先に最新の技術が投入され、70〜90年代のゲームの流行はほぼここから生まれた。名作の多くは現行機向けの復刻シリーズや収録集で遊べる。",
		amazon: { label: "アーケードコントローラーを探す", query: "アーケードコントローラー" },
	},
	pc: {
		maker: "各社", year: null, gen: "PC",
		desc: "Windows・Mac・Linuxなどのパソコン。ストラテジー、FPS、インディーゲームの主戦場で、現在はSteamなどのダウンロード販売が中心。古い名作も配信版で遊べることが多い。",
		amazon: { label: "ゲーミングPCを探す", query: "ゲーミングPC" },
	},
	atari2600: {
		maker: "Atari", year: 1977, gen: "第2世代", note: "北米での発売年。日本では「アタリ2800」として1983年に発売",
		desc: "カートリッジ交換式の家庭用ゲーム機を世界に広めた草分け。『ピットフォール!』などサードパーティ製ソフトの元祖も生まれた。2023年には現代のテレビにつながる復刻機「Atari 2600+」が出ている。",
		amazon: { label: "Atari 2600+ を探す", query: "Atari 2600+" },
	},
	fc: {
		maker: "任天堂", year: 1983, gen: "第3世代",
		desc: "日本の家庭にテレビゲームを根付かせたファミリーコンピュータ。『スーパーマリオブラザーズ』『ドラゴンクエスト』など、今も続く数々のシリーズがここから始まった。本体の復刻版「ニンテンドークラシックミニ」も発売された。",
		amazon: { label: "ニンテンドークラシックミニ ファミコンを探す", query: "ニンテンドークラシックミニ ファミリーコンピュータ" },
	},
	fds: {
		maker: "任天堂", year: 1986, gen: "第3世代",
		desc: "ファミコンにつなぐ周辺機器で、書き換え可能なディスクカードを使った。『ゼルダの伝説』『メトロイド』の初出機で、セーブ機能を家庭用に広めた。",
		amazon: { label: "ディスクシステム関連を探す", query: "ファミコン ディスクシステム" },
	},
	msx: {
		maker: "アスキー/マイクロソフトほか", year: 1983, gen: "8ビットPC",
		desc: "複数のメーカーが同じ規格で作った家庭用パソコン。『メタルギア』『グラディウス2』などコナミの名作が多く、ゲーム機としても愛された。",
		amazon: { label: "MSX関連を探す", query: "MSX" },
	},
	pc88: {
		maker: "NEC", year: 1981, gen: "8ビットPC",
		desc: "80年代の日本を代表するパソコン。『イース』『ザナドゥ』『ハイドライド』など、日本のRPGとアドベンチャーの多くがこの機種で生まれた。",
		amazon: null,
	},
	sms: {
		maker: "セガ", year: 1985, gen: "第3世代", note: "日本ではセガ・マークIIIとして発売(1987年にマスターシステム)",
		desc: "セガの8ビット家庭用機。ファミコンより高性能なグラフィックを持ち、海外ではマスターシステムとして欧州や南米で長く親しまれた。",
		amazon: null,
	},
	sfc: {
		maker: "任天堂", year: 1990, gen: "第4世代",
		desc: "回転・拡大縮小機能と高い音源性能で2Dゲームの表現を極めたスーパーファミコン。RPGの黄金期を支えた。「ニンテンドークラシックミニ スーパーファミコン」で手軽に名作に触れられる。",
		amazon: { label: "ニンテンドークラシックミニ スーファミを探す", query: "ニンテンドークラシックミニ スーパーファミコン" },
	},
	md: {
		maker: "セガ", year: 1988, gen: "第4世代",
		desc: "16ビットの処理速度を武器に、スピード感のあるアクションとシューティングで人気を得たメガドライブ。海外ではGenesisとして大ヒットした。復刻機「メガドライブミニ」がある。",
		amazon: { label: "メガドライブミニを探す", query: "メガドライブミニ" },
	},
	pce: {
		maker: "NECホームエレクトロニクス/ハドソン", year: 1987, gen: "第4世代",
		desc: "小さなHuCARDと、世界初のCD-ROMゲーム機への拡張で知られるPCエンジン。シューティングとアニメ調のアドベンチャーが充実していた。復刻機「PCエンジン mini」がある。",
		amazon: { label: "PCエンジン mini を探す", query: "PCエンジン mini" },
	},
	neogeo: {
		maker: "SNK", year: 1990, gen: "第4世代",
		desc: "業務用と同じ性能をそのまま家庭に持ち込んだ高級機。『ザ・キング・オブ・ファイターズ』『サムライスピリッツ』など、対戦格闘の名作の舞台になった。復刻機「NEOGEO mini」がある。",
		amazon: { label: "NEOGEO mini を探す", query: "NEOGEO mini" },
	},
	gb: {
		maker: "任天堂", year: 1989, gen: "携帯機",
		desc: "電池で長時間遊べるモノクロの携帯ゲーム機。『テトリス』と『ポケットモンスター』を生み、通信ケーブルで「友だちと遊ぶ」文化を作った。",
		amazon: { label: "ゲームボーイ関連を探す", query: "ゲームボーイ 本体" },
	},
	n64: {
		maker: "任天堂", year: 1996, gen: "第5世代",
		desc: "アナログスティックを標準搭載し、3Dゲームの操作を確立したNINTENDO64。4人同時プレイ用の端子も備え、『スマブラ』『ゴールデンアイ』で対戦文化を広げた。",
		amazon: { label: "NINTENDO64関連を探す", query: "NINTENDO64 本体" },
	},
	ps1: {
		maker: "ソニー・コンピュータエンタテインメント", year: 1994, gen: "第5世代",
		desc: "CD-ROMとポリゴン表現で家庭用ゲームを大人の娯楽に広げたPlayStation。『ファイナルファンタジーVII』『バイオハザード』『グランツーリスモ』など大作が集まった。復刻機「プレイステーション クラシック」がある。",
		amazon: { label: "プレイステーション クラシックを探す", query: "プレイステーション クラシック" },
	},
	saturn: {
		maker: "セガ", year: 1994, gen: "第5世代",
		desc: "2D表現に強く、格闘ゲームやシューティングの移植で熱い支持を集めたセガサターン。『バーチャファイター』『サクラ大戦』『ナイツ』などを擁した。",
		amazon: { label: "セガサターン関連を探す", query: "セガサターン 本体" },
	},
	dc: {
		maker: "セガ", year: 1998, gen: "第6世代",
		desc: "モデムを標準搭載し、家庭用でのオンライン対戦をいち早く実現したドリームキャスト。『シェンムー』『ソウルキャリバー』『ジェットセットラジオ』など意欲作が多い。",
		amazon: { label: "ドリームキャスト関連を探す", query: "ドリームキャスト 本体" },
	},
	ps2: {
		maker: "ソニー・コンピュータエンタテインメント", year: 2000, gen: "第6世代",
		desc: "DVD再生機能も備え、世界で最も売れた家庭用ゲーム機のひとつとなったPlayStation 2。『ICO』『ワンダと巨像』『GTA III』『モンスターハンター』など、ジャンルの節目となる作品が集まった。",
		amazon: { label: "PlayStation 2関連を探す", query: "PlayStation 2 本体" },
	},
	gc: {
		maker: "任天堂", year: 2001, gen: "第6世代",
		desc: "小型の光ディスクと独特のコントローラーを持つニンテンドーゲームキューブ。『ピクミン』『メトロイドプライム』『風のタクト』『バイオハザード4』を生んだ。",
		amazon: { label: "ゲームキューブ関連を探す", query: "ゲームキューブ 本体" },
	},
	xbox: {
		maker: "マイクロソフト", year: 2002, gen: "第6世代", note: "北米は2001年発売",
		desc: "PCの技術を土台にしたマイクロソフト初の家庭用機。『Halo』で家庭用FPSの基準を作り、Xbox Liveでオンライン対戦を広めた。",
		amazon: { label: "初代Xbox関連を探す", query: "初代 Xbox 本体" },
	},
	gba: {
		maker: "任天堂", year: 2001, gen: "携帯機",
		desc: "スーファミ並みの2D表現を手のひらに収めたゲームボーイアドバンス。『逆転裁判』『MOTHER3』など、2Dゲームの名作が多い。",
		amazon: { label: "ゲームボーイアドバンス関連を探す", query: "ゲームボーイアドバンス 本体" },
	},
	ds: {
		maker: "任天堂", year: 2004, gen: "携帯機",
		desc: "2画面とタッチペンで、ゲームを遊ばなかった人まで取り込んだニンテンドーDS。『脳トレ』『レイトン教授』『どうぶつの森』で社会現象を起こした。",
		amazon: { label: "ニンテンドーDS関連を探す", query: "ニンテンドーDS 本体" },
	},
	psp: {
		maker: "ソニー・コンピュータエンタテインメント", year: 2004, gen: "携帯機",
		desc: "据え置き機に近い3D表現を持ち歩けるようにしたPSP。『モンスターハンターポータブル』シリーズで「集まって協力プレイ」する文化を作った。",
		amazon: { label: "PSP関連を探す", query: "PSP 本体" },
	},
	wii: {
		maker: "任天堂", year: 2006, gen: "第7世代",
		desc: "振って遊ぶWiiリモコンで、リビングの家族全員をプレイヤーにしたWii。『Wii Sports』『Wii Fit』で世界的な大ヒットとなった。",
		amazon: { label: "Wii関連を探す", query: "Wii 本体" },
	},
	ps3: {
		maker: "ソニー・コンピュータエンタテインメント", year: 2006, gen: "第7世代",
		desc: "Blu-rayとHD映像に対応したPlayStation 3。『デモンズソウル』『The Last of Us』『風ノ旅ビト』など、作家性の強い作品が生まれた。",
		amazon: { label: "PlayStation 3関連を探す", query: "PlayStation 3 本体" },
	},
	x360: {
		maker: "マイクロソフト", year: 2005, gen: "第7世代",
		desc: "HD世代の先陣を切ったXbox 360。ダウンロード販売の場「Xbox Live アーケード」から『Braid』『LIMBO』などインディーの名作が広まった。",
		amazon: { label: "Xbox 360関連を探す", query: "Xbox 360 本体" },
	},
	"3ds": {
		maker: "任天堂", year: 2011, gen: "携帯機",
		desc: "裸眼立体視を実現したニンテンドー3DS。『とびだせ どうぶつの森』『ファイアーエムブレム 覚醒』など、携帯機ならではの名作が多い。",
		amazon: { label: "ニンテンドー3DS関連を探す", query: "ニンテンドー3DS 本体" },
	},
	vita: {
		maker: "ソニー・コンピュータエンタテインメント", year: 2011, gen: "携帯機",
		desc: "有機ELとタッチ操作を備えたPlayStation Vita。インディーゲームや日本のRPG・ノベルゲームの受け皿として長く愛された。",
		amazon: { label: "PS Vita関連を探す", query: "PlayStation Vita 本体" },
	},
	wiiu: {
		maker: "任天堂", year: 2012, gen: "第8世代",
		desc: "画面付きのゲームパッドを持つWii U。『スプラトゥーン』『スーパーマリオメーカー』が生まれ、多くの作品がのちにSwitchへ移植された。",
		amazon: { label: "Wii U関連を探す", query: "Wii U 本体" },
	},
	ps4: {
		maker: "ソニー・インタラクティブエンタテインメント", year: 2014, gen: "第8世代", note: "北米は2013年発売",
		desc: "シェア機能を標準搭載し、配信と実況の時代を支えたPlayStation 4。『Bloodborne』『ペルソナ5』『ゴッド・オブ・ウォー』など名作が厚い。多くのソフトがPS5でも動く。",
		amazon: { label: "PlayStation 4関連を探す", query: "PlayStation 4 本体" },
	},
	xone: {
		maker: "マイクロソフト", year: 2014, gen: "第8世代", note: "北米は2013年発売",
		desc: "後方互換とGame Passで「過去のゲームを遊べる場所」を広げたXbox One。ソフトの多くはXbox Series X|Sでそのまま遊べる。",
		amazon: { label: "Xbox One関連を探す", query: "Xbox One 本体" },
	},
	switch: {
		maker: "任天堂", year: 2017, gen: "第8世代",
		desc: "テレビにつなげても持ち出しても遊べるNintendo Switch。『ブレス オブ ザ ワイルド』『あつまれ どうぶつの森』のほか、インディーゲームや往年の名作の移植も豊富。",
		amazon: { label: "Nintendo Switch本体を探す", query: "Nintendo Switch 本体" },
	},
	ps5: {
		maker: "ソニー・インタラクティブエンタテインメント", year: 2020, gen: "第9世代",
		desc: "高速なSSDと触覚フィードバックのDualSenseを備えたPlayStation 5。PS4のソフトもほとんど遊べる。",
		amazon: { label: "PlayStation 5本体を探す", query: "PlayStation 5 本体" },
	},
	xsx: {
		maker: "マイクロソフト", year: 2020, gen: "第9世代",
		desc: "高性能なSeries Xと小型のSeries S。Game Passと手厚い後方互換で、Xboxの歴代ソフトを遊べる。",
		amazon: { label: "Xbox Series X|S本体を探す", query: "Xbox Series X 本体" },
	},
	switch2: {
		maker: "任天堂", year: 2025, gen: "第9世代",
		desc: "画面とJoy-Conが大型化したNintendo Switch 2。多くのSwitchソフトがそのまま遊べ、一部は強化版の「Nintendo Switch 2 Edition」も出ている。",
		amazon: { label: "Nintendo Switch 2本体を探す", query: "Nintendo Switch 2 本体" },
	},
	mobile: {
		maker: "各社", year: 2008, gen: "スマートフォン", note: "App Store開始の年",
		desc: "iPhoneとAndroidのアプリストアで遊ぶゲーム。指一本で遊べるパズルから本格RPGまで、世界で最も遊ばれているゲーム機でもある。",
		amazon: { label: "スマホ用コントローラーを探す", query: "スマホ ゲームコントローラー" },
	},
	vr: {
		maker: "各社", year: 2016, gen: "VR", note: "主要なVR機器が出そろった年",
		desc: "頭にかぶるヘッドセットで、ゲームの世界に入り込むVR。PCにつなぐタイプと単体で動くタイプがある。",
		amazon: { label: "VRヘッドセットを探す", query: "VRヘッドセット" },
	},
};
