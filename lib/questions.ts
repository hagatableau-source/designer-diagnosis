export type Axis =
  | "structure"
  | "ux"
  | "atmosphere"
  | "abstract"
  | "sensory"
  | "obsession"
  | "dummy";


export type ObservationChoice = {
  text: string;
  axis: Axis;
  weight?: number;
};

export type ObservationQuestion = {
  id: number;
  phase: "rank" | "remove" | "add";
  title: string;
  choices?: ObservationChoice[];
};

export const observationQuestions: ObservationQuestion[] = [
  // Phase1：気になるものを3つ選ぶ（加点）
  {
    id: 1,
    phase: "rank",
  title: "知らない街の交差点、無意識に見ていることは？",
    choices: [
      { text: "道のつながり方", axis: "structure" },
      { text: "スムーズに渡れるか", axis: "ux" },
      { text: "行き交う人の顔", axis: "atmosphere" }, // ← バッチリです！
      { text: "ここがどんな街か", axis: "abstract" },
      { text: "風の強さや日差し", axis: "sensory" },
      { text: "看板などのデザイン", axis: "obsession" }
    ]
  },
  {
    id: 2,
    phase: "rank",
   title: "初めて入ったカフェで、居心地を左右する要素は？",
    choices: [
      { text: "店内の座席配置", axis: "structure" }, // 「動線」より居心地に直結
      { text: "注文のスムーズさ", axis: "ux" },     // より直感的な表現に
      { text: "照明の明るさ", axis: "atmosphere" }, // 「温度」より分かりやすく
      { text: "お店のコンセプト", axis: "abstract" },
      { text: "椅子の座り心地", axis: "sensory" },    // 「硬さ」より自然に
      { text: "カップの形や柄", axis: "obsession" }   // ディテールへのこだわり
    ]
  },
  {
    id: 3,
    phase: "rank",
    title: "新しくできたお洒落なショップ。中に入って真っ先に目がいくのは？", // ← 重複回避のための新設！
    choices: [
      { text: "フロア全体のレイアウト", axis: "structure" },
      { text: "お目当ての売り場の位置", axis: "ux" },
      { text: "店内に漂う洗練された空気", axis: "atmosphere" },
      { text: "このお店が掲げるテーマ", axis: "abstract" },
      { text: "心地よく響くお洒落なBGM", axis: "sensory" },
      { text: "値札タグのユニークな形", axis: "obsession" }
    ]
  },
  {
    id: 4,
    phase: "rank",
   title: "買った電化製品の箱を開けた瞬間、あなたが惹きつけられるものは？",
    choices: [
      { text: "梱包の配置", axis: "structure" },
      { text: "押しやすそうなボタン", axis: "ux" },
      { text: "新品ならではの光沢感", axis: "atmosphere" },
      { text: "説明書の1ページ目", axis: "abstract" },
      { text: "箱から漂う新品の匂い", axis: "sensory" },
      { text: "ニッチな付属パーツ", axis: "obsession" } // マニア心をくすぐるこだわり
    ]
  },
  {
    id: 5,
    phase: "rank",
    title: "道具を使い続けたいと思う「決定的な」理由は？",
    choices: [
      { text: "合理的な構成", axis: "structure" },
      { text: "馴染む操作", axis: "ux" },
      { text: "気分の高揚", axis: "atmosphere" },
      { text: "普遍的な価値", axis: "abstract" },
      { text: "素材の質感", axis: "sensory" },
      { text: "緻密な仕上げ", axis: "obsession" },
    ],
  },
  {
    id: 6,
    phase: "rank",
  title: "お気に入りのペンを「ずっと使い続けたい」と思う決定的な理由は？",
    choices: [
      { text: "無駄のない重心バランス", axis: "structure" }, // 構造・設計の美しさ
      { text: "流れるような書き味", axis: "ux" },       // ストレスのない快適な使用感
      { text: "デスクに置いた佇まい", axis: "atmosphere" }, // 持っている空間の空気感
      { text: "一生物というブランド価値", axis: "abstract" }, // 普遍的な概念・歴史
      { text: "指先に馴染む素材の質感", axis: "sensory" },    // ダイレクトな心地よさ
      { text: "クリップの緻密なバネ感", axis: "obsession" }   // そこ！？というマニアックな細部
    ]
  },
  {
    id: 7,
    phase: "rank",
    title: "こだわりのグルメバーガーが届いた時、真っ先に目が向くところは？",
    choices: [
      { text: "崩れそうなほどの積層美", axis: "structure" }, // 具材の組み合わせ・構造
      { text: "どう持てば綺麗に食べられるか", axis: "ux" },     // 食べる体験・スムーズさ
      { text: "アメリカンな包み紙のワクワク感", axis: "atmosphere" }, // お店の世界観・空気感
      { text: "シェフが狙った味のコンセプト", axis: "abstract" }, // 具材の相性や全体のテーマ・概念
      { text: "ジュージュー鳴る音と肉汁の匂い", axis: "sensory" },    // 聴覚・嗅覚のダイレクトな五感
      { text: "バンズの焼き目の均一さ", axis: "obsession" }   // 細部へのマニアックなこだわり
    ]
  },
  {
    id: 8,
    phase: "rank",
   title: "大規模なテクノロジー展示会に入った瞬間、あなたのアンテナが真っ先に反応するのは？",
    choices: [
      { text: "会場全体のブースマップ", axis: "structure" },
      { text: "混雑を避けるルート選び", axis: "ux" },
      { text: "会場を包むクリエイティブな熱気", axis: "atmosphere" },
      { text: "今回のイベントが掲げる大テーマ", axis: "abstract" },
      { text: "巨大スクリーンの眩しさと重低音", axis: "sensory" },
      { text: "イベントロゴの文字デザイン", axis: "obsession" } // ディテールへの執着
    ]
  },
  {
    id: 9,
    phase: "rank",
   title: "面白い映画のストーリーを誰かに説明する時、あなたが最も意識することは？",
    choices: [
      { text: "伏線と回収の組み立て方", axis: "structure" }, // 話の構造・ロジック
      { text: "飽きずに理解できるか", axis: "ux" },     // 聞き手の体験・スムーズさ
      { text: "映画が持つ独特の世界観", axis: "atmosphere" }, // 作品の空気感を伝える
      { text: "背後にある深いテーマ", axis: "abstract" }, // 概念や本質的な意味
      { text: "身振り手振りと話すテンポ", axis: "sensory" },    // リズムや声のトーン（五感）
      { text: "お気に入りのセリフの再現度", axis: "obsession" }   // 特定のディテールへのこだわり
    ]
  },
  {
    id: 10,
    phase: "rank",
    title: "ホテルの客室に入った瞬間、無意識にチェックするのは？",
    choices: [
      { text: "部屋の間取り", axis: "structure" },
      { text: "設備の使いやすさ", axis: "ux" },
      { text: "部屋の匂いや空気", axis: "atmosphere" },
      { text: "期待通りのクオリティ", axis: "abstract" }, // ブランドイメージとのギャップ
      { text: "窓から見える景色", axis: "sensory" },
      { text: "家具や木目の美しさ", axis: "obsession" }
    ]
  },

  // Phase2：なくてもいいと思うものを3つ選ぶ（減点）
  {
    id: 101,
    phase: "remove",
  title: "コンビニのレジ待ち中、あなたが一番気にしないのは？",
    choices: [
      { text: "並び方のルール", axis: "structure" },   // 構造：並び方なんてどうでもいい
      { text: "レジの案内サイン", axis: "ux" },       // UX：案内なんか見なくても行ける
      { text: "店内の忙しい空気", axis: "atmosphere" }, // 雰囲気：周りの空気感なんか知らん
      { text: "お店の売り込み戦略", axis: "abstract" }, // 概念：レジ横の戦略とか興味ない
      { text: "レジ前の食べ物の匂い", axis: "sensory" },  // 五感：匂いとか特に気にならない
      { text: "床のタイルの汚れ", axis: "obsession" }   // こだわり：細かい汚れとかどうでもいい
    ]
  },
  {
    id: 102,
    phase: "remove",
    title: "友人の玄関。入った瞬間の一番気にしない要素は？",
    choices: [
      { text: "靴の並び方", axis: "structure" },
      { text: "段差の高さ", axis: "ux" },
      { text: "部屋の匂い", axis: "atmosphere" },
      { text: "家族の構成", axis: "abstract" },
      { text: "床の質感", axis: "sensory" },
      { text: "ドアの指紋", axis: "obsession" },
    ],
  },
  {
    id: 103,
    phase: "remove",
   title: "駅のホームで電車を待つ間、あなたが一番気にしないのは？",
    choices: [
      { text: "次の乗り換えルート", axis: "structure" },
      { text: "電車の到着時刻", axis: "ux" },
      { text: "ホームのガヤガヤ感", axis: "atmosphere" },
      { text: "電車のデザイン", axis: "abstract" }, // 視界に入るけど興味ない人にはどうでもいい「概念・ブランド」
      { text: "線路からの冷たい風", axis: "sensory" },
      { text: "自販機の並びのズレ", axis: "obsession" }
    ]
  },
  {
    id: 104,
    phase: "remove",
    title: "映画館の席に座った瞬間、あなたが一番気にしないのは？",
    choices: [
      { text: "スクリーンへの角度", axis: "structure" }, // 構造：見やすい位置関係か
      { text: "シートの座り心地", axis: "ux" },        // UX：２時間座って疲れないか
      { text: "シアター内の高揚感", axis: "atmosphere" }, // 雰囲気：上映前のワクワクした空気
      { text: "映画の制作会社", axis: "abstract" },     // 概念：ハリウッド大作か単館系か
      { text: "館内のひんやり感", axis: "sensory" },     // 五感：空調の温度や肌寒さ
      { text: "ドリンクホルダーの位置", axis: "obsession" } // こだわり：左右どっちを使うか等の細部
    ]
  },
  {
    id: 105,
    phase: "remove",
    title: "図書館で本を読んでいる時、あなたが気にしないのは？",
    choices: [
      { text: "周囲の座席配置", axis: "structure" },
      { text: "椅子の座り心地", axis: "ux" },
      { text: "館内のガヤガヤ感", axis: "atmosphere" },
      { text: "近くの人の本のジャンル", axis: "abstract" },
      { text: "紙の触り心地", axis: "sensory" }, // 「触覚」に特化してより読書らしく！
      { text: "他人のペンの音", axis: "obsession" }
    ]
  },
  {
    id: 106,
    phase: "remove",
   title: "雨の日に傘をさして歩く時、あなたが気にしないのは？",
    choices: [
      { text: "雨宿りできる場所", axis: "structure" }, // 構造：街のシェルター（避難場所）の位置関係
      { text: "靴への浸水", axis: "ux" },           // UX：足元が濡れて不快かどうかの実用性
      { text: "どんよりした空気", axis: "atmosphere" }, // 雰囲気：雨の日独特の気だるい空気感
      { text: "傘のブランド", axis: "abstract" },     // 概念：ビニール傘か、お気に入りの高級傘か
      { text: "水たまりの跳ねる音", axis: "sensory" },  // 五感：耳に飛び込んでくる雨の音
      { text: "傘の持ち手のベタつき", axis: "obsession" } // こだわり：手元の微細な感触・不快感
    ]
  },
  {
    id: 107,
    phase: "remove",
    title: "新しいスマホの初期設定中、あなたが気にしないのは？",
    choices: [
      { text: "完了までのステップ", axis: "structure" }, // 構造：全体の工程数やステップの枠組み
      { text: "設定の操作性", axis: "ux" },
      { text: "画面のデザイン", axis: "atmosphere" },
      { text: "各機能の背景にある思想", axis: "abstract" },
      { text: "画面の入れ替わり方", axis: "sensory" },
      { text: "フォントの美しさ", axis: "obsession" }
    ]
  },
  {
    id: 108,
    phase: "remove",
   title: "夜の公園を通り抜ける時、あなたが気にしないのは？",
    choices: [
      { text: "外灯の配置", axis: "structure" },     // 構造：光の届く位置関係
      { text: "公園の歩きやすさ", axis: "ux" },       // UX：足元の快適性・安全性
      { text: "夜の静けさ", axis: "atmosphere" },   // 雰囲気：その場を包む空気
      { text: "公園にいる人", axis: "abstract" },     // 概念：他人が何をしているかという背景
      { text: "草木のこすれる音", axis: "sensory" },   // 五感：耳に入る環境音
      { text: "公園にある落書き", axis: "obsession" }  // こだわり：視界の隅の微細な汚れ・ディテール
    ]
  },
  {
    id: 109,
    phase: "remove",
   title: "家で映画やテレビを見る時、あなたが気にしないのは？",
    choices: [
      { text: "部屋の家具の配置", axis: "structure" },
      { text: "リモコンの置き場所", axis: "ux" },
      { text: "部屋の明るさ", axis: "atmosphere" },
      { text: "番組の制作意図", axis: "abstract" },
      { text: "外の音", axis: "sensory" },
      { text: "画面への映り込み", axis: "obsession" }
    ]
  },
  {
    id: 110,
    phase: "remove",
    title: "ビジネスで名刺をもらった時、あなたが気にしないのは？",
    choices: [
      { text: "情報の配置バランス", axis: "structure" },
      { text: "連絡先の見やすさ", axis: "ux" },
      { text: "名刺から漂う高級感", axis: "atmosphere" },
      { text: "企業の公式ロゴ", axis: "abstract" },
      { text: "紙の触り心地", axis: "sensory" },
      { text: "名前のフォントサイズ", axis: "obsession" } // 完璧なディテール（こだわり）軸！
    ]
  },

 
  // Phase3：3つ選択（認知特性の抽出）
  {
    id: 201,
    phase: "add",
    title: "離陸直前の機内でじっとしている時、あなたが気にするのは？",
    choices: [
      // --- 【本命：オブジェクト・空間へのセンサーを裏返す6 択】 ---
      { text: "頭上の荷物棚の並び", axis: "structure" }, // 構造：機内を構成する均整のとれた枠組み
      { text: "乗務員のスムーズな動き", axis: "ux" },     // UX：安全と快適性を提供するプロの動線
      { text: "密閉された特有の空気感", axis: "atmosphere" }, // 雰囲気：これから飛び立つ空間が纏う独特のムード
      { text: "シートベルトの構造の仕組み", axis: "abstract" }, // 概念：安全を守るための機構や設計思想のロジック
      { text: "足元から響くエンジン音の振動", axis: "sensory" }, // 五感：身体にダイレクトに伝わる物理的な音と揺れ（触覚）
      { text: "読書灯が座席を照らす光の形", axis: "obsession" }, // こだわり：普通の人が見落とす、天井の微細なデザイン

      // --- 【ダミー：空間への感性が完全にゼロである状態を吸い取る 4択】 ---
      { text: "安全のしおりを眺める", axis: "dummy" },
      { text: "スマホの設定を確認する", axis: "dummy" },
      { text: "前ポケットの物が少し気になる", axis: "dummy" },
      { text: "荷物の置き場を確認する", axis: "dummy" },
    ]
  },
  {
    id: 202,
    phase: "add",
  title: "朝の服選び。あなたが最後の「決め手」にするのは？",
    choices: [
      // --- 【本命：オブジェクト・自己表現への感性を測る 6択】 ---
      { text: "全体の色やトーンの調和", axis: "structure" }, // 構造：カラーパレットの組み合わせや全体の輪郭
      { text: "一日を快適に動ける機能性", axis: "ux" },       // UX：過ごしやすさ、身体にかかるストレスのなさ
      { text: "その服が放つ洗練された品格", axis: "atmosphere" }, // 雰囲気：服が纏うクオリティや独自の空気感
      { text: "服のブランドが持つ背景", axis: "abstract" }, // 概念：デザイナーの意図や歴史などの深い文脈
      { text: "布地の柔らかく優しい肌ざわり", axis: "sensory" }, // 五感：皮膚に触れた瞬間のダイレクトな心地よさ
      { text: "襟元のカッティングの絶妙なライン", axis: "obsession" }, // こだわり：ミリ単位の首元のこだわりやディテール

      // --- 【ダミー：服への感性が完全にゼロである状態を吸い取る 4択】 ---
      { text: "手前にあった服を選ぶ", axis: "dummy" },
      { text: "気温に合わせて決める", axis: "dummy" },
      { text: "昨日出していた服を着る", axis: "dummy" },
      { text: "急いで着替えられるものにする", axis: "dummy" },
    ]
  },
  {
    id: 203,
    phase: "add",
   title: "古い喫茶店のカウンター席。ついあなたの目が奪われるのは？",
    choices: [
      // --- 【本命：オブジェクト・空間への感性を測る 6択】 ---
      { text: "ずらりと並ぶカップの棚", axis: "structure" }, // 構造：美しく整列したコレクションの枠組みや配置
      { text: "椅子の絶妙な座り心地", axis: "ux" },       // UX：身体に馴染むかどうかという、実用的な快適性
      { text: "セピア色に染まった壁紙", axis: "atmosphere" }, // 雰囲気：時間の経過が醸し出す、店のトーンや世界観
      { text: "マスターが貫くお店の理念", axis: "abstract" }, // 概念：店の佇まいや営業スタイルの裏にある思想・文脈
      { text: "珈琲が注がれる密やかな音", axis: "sensory" },  // 五感：耳からダイレクトに流れ込む、心地よい音響刺激
      { text: "使い込まれた伝票立ての形", axis: "obsession" }, // こだわり：普通の人が見落とす、卓上の超ミクロなディテール

      // --- 【ダミー：喫茶店への感性が完全にゼロである状態を吸い取る 4択】 ---
      { text: "テーブルの端に置かれた伝票", axis: "dummy" },  // 感性ゼロ：単なる事務的な支払いの紙（記号）
      { text: "メニュー表に記載された価格", axis: "dummy" }, // 感性ゼロ：単なるコストの計算（経済）
      { text: "スマホの画面に表示された現在時刻", axis: "dummy" }, // 感性ゼロ：ただの時間の経過確認（情報）
      { text: "壁に設置された避難口の標識", axis: "dummy" }  // 感性ゼロ：単なる記号的な設備の視認（状況）
    ]
  },
  {
    id: 204,
    phase: "add",
 title: "美術館の展示。作品そのものより、あなたが「つい気にしてしまう」のは？",
    choices: [
      // --- 【本命：オブジェクト・空間への感性を測る 6択】 ---
      { text: "作品を囲む余白の広さ", axis: "structure" }, // 構造：ホワイトキューブとしての空間の枠組みやバランス
      { text: "隣の鑑賞客との距離感", axis: "ux" },       // UX：他人に邪魔されず快適に鑑賞できるかという実用性
      { text: "部屋に漂う静かな緊張感", axis: "atmosphere" }, // 雰囲気：美術館という空間が纏う特有の空気感やムード
      { text: "展示に込められた思想", axis: "abstract" },   // 概念：キュレーターの意図やテーマ、背後にある文脈
      { text: "作品を照らす光の角度", axis: "sensory" },   // 五感：照明がもたらす陰影や、ダイレクトな視覚刺激
      { text: "作品の横の解説パネル", axis: "obsession" }, // こだわり：フォントや配置など、キャプションの微細なディテール

      // --- 【ダミー：アートや空間への感性が完全にゼロである状態を吸い取る 4択】 ---
      { text: "パンフレットの文字の羅列", axis: "dummy" },  // 感性ゼロ：単なる印刷された記号の確認（情報）
      { text: "美術館ショップの営業時間", axis: "dummy" }, // 感性ゼロ：ただの買い物タスクへの意識（予定）
      { text: "歩きすぎて痛む足の感覚", axis: "dummy" }, // 感性ゼロ：単なる肉体的な疲労（現状・外因）
      { text: "出口を出た後の昼食メニュー", axis: "dummy" }  // 感性ゼロ：今ここの空間からの完全な意識逃避（欲求）
    ]
  },
  {
    id: 205,
    phase: "add",
title: "満員のエレベーター。他人と密着する空間で、あなたが気にしてしまうのは？",
    choices: [
      // --- 【本命：オブジェクト・空間への感性を測る6択】 ---
      { text: "他人の体の向きと配置", axis: "structure" }, // 構造：狭い箱の中の、人間の詰め込まれ方
      { text: "階数ボタンとの距離感", axis: "ux" },       // UX：奥に追いやられてボタンを押せるかという実用性
      { text: "車内に満ちる沈黙の壁", axis: "atmosphere" }, // 雰囲気：誰もしゃべらない気まずい空気感
      { text: "到着階までの残り秒数", axis: "abstract" },   // 概念：早く解放されたいという、時間（数字）への意識
      { text: "至近距離にある人の体温", axis: "sensory" },   // 五感：触れそうな距離から伝わる熱（触覚）
      { text: "ドアの開閉の心地よさ", axis: "obsession" },  // こだわり：スムーズにピタッと閉まる微細な美しさ

      // --- 【ダミー：空間への感性が完全にゼロである状態を吸い取る4択】 ---
      { text: "スマホに届いている通知", axis: "dummy" }, // 感性ゼロ：目の前の空間からの完全な逃避（情報）
      { text: "昨日見たテレビ番組の場面", axis: "dummy" }, // 感性ゼロ：脳内での過去の再生（記憶）
      { text: "ただ床の一点を見つめた硬直した視界", axis: "dummy" }, // 感性ゼロ：思考と視覚の完全なシャットダウン（停止）
      { text: "ポケットの中の小銭を指先で数える", axis: "dummy" }  // 感性ゼロ：手元の単純動作への意識集中（タスク）
    ]
  },
  {
    id: 214, // 例
    phase: "add",
    title: "あなたが『特別なコーヒー』を飲もうと思った時、買いに行くのは？",
    choices: [
      // --- 【本命：オブジェクトへの感性を測る6択】 ---
      { text: "定番ブランドが並ぶ大型スーパー", axis: "structure" }, // 構造：流通の仕組み、大手の安心感、整然とした棚
      { text: "最新マシンのある近くのコンビニ", axis: "ux" },       // UX：手軽さ、スピード、日常の圧倒的な利便性
      { text: "街角にあるお洒落なコーヒースタンド", axis: "atmosphere" }, // 雰囲気：その場所が纏う空気感やカルチャー
      { text: "独自の哲学を掲げる自家焙煎ロースター", axis: "abstract" }, // 概念：店主の焙煎思想、豆のコンセプト
      { text: "淹れたての香りが店外まで漂うカフェ", axis: "sensory" },   // 五感：香ばしい匂いというダイレクトな五感刺激
      { text: "ロゴやパッケージが洗練されたショップ", axis: "obsession" }, // こだわり：パケ買いしたくなる微細なデザイン

      // --- 【ダミー：コーヒーへの感性が完全にゼロである状態を吸い取る4択】 ---
      { text: "一番近くにある場所で買う", axis: "dummy" },
      { text: "無料ならそれで十分だと思う", axis: "dummy" },
      { text: "手元にある飲み物で済ませる", axis: "dummy" },
      { text: "空いている時間内で済ませる", axis: "dummy" },
    ]
  },
  {
    id: 207,
    phase: "add",
    title: "プレゼンテーションの資料づくり。あなたが「つい気にしてしまう」のは？",
    choices: [
      // --- 【本命：オブジェクトへの感性を測る6択】 ---
      { text: "全体のレイアウトの綺麗さ", axis: "structure" }, // 構造：画面の枠組みやグリッドの美しさ
      { text: "パッと見た時の読みやすさ", axis: "ux" },       // UX：受け手が直感的に理解できる快適性
      { text: "資料全体が纏う洗練された美", axis: "atmosphere" }, // 雰囲気：スライドが醸し出すトーンや品格
      { text: "一番伝えたい情報の優先順", axis: "abstract" }, // 概念：ロジックとしての構成の伝わりやすさ
      { text: "スライド内の贅沢な余白感", axis: "sensory" }, // 五感：情報が詰まりすぎていない、心地よい視覚刺激
      { text: "画像と文字のわずかな間隔", axis: "obsession" },  // こだわり：数ピクセル単位の超ミクロなこだわり

      // --- 【ダミー：資料への感性が完全にゼロである状態を吸い取る4択】 ---
      { text: "締め切りの時間を確認する", axis: "dummy" },
      { text: "決まった形式に合わせる", axis: "dummy" },
      { text: "バッテリー残量が気になる", axis: "dummy" },
      { text: "次の予定を少し考えている", axis: "dummy" },
    ] 
  },
  {
    id: 208,
    phase: "add",
  title: "歴史ある古い建物。その前に立った時、あなたが「つい見つめてしまう」のは？",
    choices: [
      // --- 【本命：オブジェクトへの感性を測る6択】 ---
      { text: "重厚な柱や梁の並び", axis: "structure" },   // 構造：建物を支える骨組みやダイナミックな枠組み
      { text: "優しく迎え入れる入口の形", axis: "ux" },   // UX：中へ入りたくなるような、空間の親切な設計
      { text: "静寂を包むどこか切ない波長", axis: "atmosphere" }, // 雰囲気：その場所が纏う、情緒やノスタルジー
      { text: "昔ここに作られた本当の理由", axis: "abstract" }, // 概念：建物の背景にある歴史や誕生のストーリー
      { text: "夕日に照らされた壁の陰影", axis: "sensory" }, // 五感：光と影が織りなすダイレクトな美しさ（視覚）
      { text: "職人の技が光る釘の打ち方", axis: "obsession" }, // こだわり：細部に宿る、昔の職人の微細なディテール

      // --- 【ダミー：建物への感性が完全にゼロである状態を吸い取る4択】 ---
      { text: "建物の名前を確認する", axis: "dummy" },
      { text: "入場料を確認する", axis: "dummy" },
      { text: "今どの順番かを見る", axis: "dummy" },
      { text: "疲れてきた感覚", axis: "dummy" },
    ]
  },
  {
    id: 209,
    phase: "add",
title: "差し出された名刺を受け取った瞬間、あなたの目が真っ先に向かうのは？",
    choices: [
      // --- 【本命：オブジェクトへの感性を測る6択】 ---
      { text: "ロゴや文字の配置バランス", axis: "structure" },   // 構造：91×55mmの枠の中にどう収まっているか
      { text: "パッと読める文字の大きさ", axis: "ux" },         // UX：名刺としての実用的な読みやすさ
      { text: "名刺から漂う誠実な空気感", axis: "atmosphere" },  // 雰囲気：その1枚が纏っている全体の品格・ムード
      { text: "会社の理念やメッセージ", axis: "abstract" },     // 概念：裏面やロゴに込められた思想やコンセプト
      { text: "手に伝わる紙の厚みと硬さ", axis: "sensory" },     // 五感：触れた瞬間にわかるリアルな紙質（触覚）
      { text: "カードの角の丸みやカタチ", axis: "obsession" },   // こだわり：角丸か直角かという、端っこの微細なデザイン

   // --- 【ダミー：名刺への感性が完全にゼロである状態を自然に吸い取る4択】 ---
      { text: "相手の肩書きや立場を把握するためのもの", axis: "dummy" },
      { text: "名刺交換の場の空気を崩さないための礼儀", axis: "dummy" },
      { text: "後で誰だったか思い出せるように保管するもの", axis: "dummy" },
      { text: "仕事を進めるために必要な連絡情報", axis: "dummy" }, 
    ]
  },
  {
    id: 210,
    phase: "add",
    title: "ノートの1ページ目。ペンを置く直前に、あなたをためらわせるのは？",
    choices: [
      { text: "引き込まれる罫線の並び", axis: "structure" }, 
    { text: "最初の一文字を書く位置", axis: "ux" },       
    { text: "真っ白な紙が放つ緊張感", axis: "atmosphere" }, 
    { text: "最初から失敗したくない心", axis: "abstract" }, 
    { text: "紙肌のサラサラした手触り", axis: "sensory" },   
    { text: "端にある小さなガイド点", axis: "obsession" }, 
    // --- 【本物のダミー：6軸のどれにも当てはまらない、ただの事実・外因】 ---
    { text: "とりあえず書き始める", axis: "dummy" },
    { text: "今日の日付を確認する", axis: "dummy" },
    { text: "手元の紙をそのまま使う", axis: "dummy" },
    { text: "急がなきゃという感じ", axis: "dummy" },
    ]
  },
];