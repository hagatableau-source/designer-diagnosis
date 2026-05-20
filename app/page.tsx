"use client";

import { useMemo, useState, useEffect } from "react";
import { Brain, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  observationQuestions,
  type Axis,
  type ObservationChoice,
} from "../lib/questions";

type Profile = {
  name: string;
  email: string;
  age: string;
  experience: string;
};

type AnswerRecord = {
  questionId: number;
  phase: "rank" | "remove" | "add";
  rankedChoices?: ObservationChoice[];
  removedChoice?: ObservationChoice;
  addedWord?: string;
  addedWords?: string[];
  mappedAxis?: Axis;
  mappedAxes?: Axis[];
};

type AiComment = {
  summary: string;
  strength: string;
  risk: string;
  aiNote: string;
  isSuper?: boolean;
  coveredAxes?: Axis[];
  highlightAxes?: Axis[];
  adjustments?: {
    structure?: number;
    ux?: number;
    atmosphere?: number;
    abstract?: number;
    sensory?: number;
    obsession?: number;
  };
};


type Phase =
  | "cover"
  | "profile"
  | "phaseIntro"
  | "question"
  | "analyzing"
  | "result";




const labels: Record<Exclude<Axis, "dummy">, string> = {
  structure: "情報構築",
  ux: "UX認知",
  atmosphere: "空気演出",
  abstract: "抽象理解",
  sensory: "感覚認知",
  obsession: "観察執着",
};


type RealAxis = Exclude<Axis, "dummy">;

const isRealAxis = (axis: Axis): axis is RealAxis => axis !== "dummy";



const personalityMap = [
  {
    axes: ["structure", "ux"],
    key: "flowObserver",
    title: "導線観測者",
    description: "人の流れ・導線・行動遷移を見る",
    jobs: ["UXデザイナー", "UI設計", "サービス設計", "建築動線設計", "Webディレクター", "EC改善", "空間設計", "店舗導線設計"],
    strengthText: "「人がどこで止まり、どこへ流れるか」を読む。",
  },
  {
    axes: ["structure", "abstract"],
    key: "conceptEditor",
    title: "概念編集者",
    description: "概念や思想を整理し構造化する",
    jobs: ["ブランド戦略", "編集者", "コピーライター" , "コンセプト設計",  "教育設計", "哲学系研究", "経営企画"],
    strengthText: "複雑な思想を「伝わる形」に翻訳する。",
  },
  {
    axes: ["ux", "obsession"],
    key: "behaviorObserver",
    title: "行動観測者",
    description: "ユーザー行動や癖を異常に観察する",
    jobs: ["UXリサーチャー","マーケター","行動分析","データUX","カスタマー分析","医療観察","人類学"],
    strengthText: "「なぜ人はそう動くのか」を執拗に見る。",
  },
  {
    axes: ["atmosphere", "sensory"],
    key: "temperatureSensor",
    title: "温度感知者",
    description: "空気感や情緒の温度を感じ取る",
    jobs: ["写真家","映像作家","インテリア","アートディレクター","カフェ空間設計 ","音楽","ブランドビジュアル"],
    strengthText: "言葉にできない“空気”を感じる。",
  },
  {
    axes: ["abstract", "obsession"],
    key: "contextReader",
    title: "文脈解読者",
    description: "背景の意味や文脈を深掘りする",
    jobs: ["批評家","研究者","文化分析","コピーライター","編集者","思想研究","ブランド考察"],
    strengthText: "「なぜそれが存在するのか」を掘る。",
  },
  {
    axes: ["sensory", "obsession"],
    key: "noiseObserver",
    title: "違和感探知者",
    description: "微細なノイズや違和感を検知する",
    jobs: ["校正","UI品質管理","映像編集","レタッチ","医療診断","デバッグ"],
    strengthText: "普通の人が見逃すズレを止められる。",
  },
  {
    axes: ["structure", "atmosphere"],
    key: "airArchitect",
    title: "空気構築者",
    description: "世界観や場の空気を設計する",
    jobs: ["ブランドデザイナー","空間演出","展示設計","イベント演出","アートディレクター","店舗ブランディング"],
    strengthText: "「空気」を構造として設計できる。",
  },
  {
    axes: ["structure", "sensory"],
    key: "sensoryEditor",
    title: "感覚編集者",
    description: "感覚や美しさを整理・調律する",
    jobs: ["グラフィックデザイナー","タイポグラファ","UIビジュアル","エディトリアル","モーション設計","DTP"],
    strengthText: "感覚を秩序化できる。",
  },
  {
    axes: ["ux", "atmosphere"],
    key: "behaviorDirector",
    title: "行動演出者",
    description: "行動したくなる空気や体験を演出する",
    jobs: ["広告","CM演出","店舗体験設計","SNS企画","イベント演出","UX演出","接客設計"],
    strengthText: "「やってみたくなる空気」を作る。",
  },
  {
    axes: ["abstract", "sensory"],
    key: "conceptSensor",
    title: "概念感知者",
    description: "概念や思想を感覚的に捉える",
    jobs: ["現代アート","詩","コンセプトデザイン","映像作家","哲学表現","実験的ブランド"],
    strengthText: "抽象概念を感覚で表現できる。",
  },
  {
    axes: ["atmosphere", "obsession"],
    key: "airObserver",
    title: "空気観測者",
    description: "場の空気や温度変化を鋭く観測する",
    jobs: ["接客","演出監督","チームマネジメント","看護","ファシリテーター","舞台演出"],
    strengthText: "空気の変化に異常に敏感。",
  },
  {
    axes: ["ux", "abstract"],
    key: "uxReader",
    title: "UX解読者",
    description: "行動原理やUXの本質を読み解く",
    jobs: ["UX戦略","サービスデザイン","行動心理","HCD研究","プロダクト戦略","認知研究"],
    strengthText: "「なぜそのUXが成立するか」を理解する。",
  },
  {
    axes: ["structure", "obsession"],
    key: "obsessiveBuilder",
    title: "執着構築者",
    description: "強いこだわりで構造を磨き上げる",
    jobs: ["エンジニア","建築","フロントエンド","システム設計","組版","UI設計"],
    strengthText: "構造の完成度を極限まで高める。",
  },
  {
    axes: ["ux", "sensory"],
    key: "experienceSensor",
    title: "体験感知者",
    description: "UXを身体感覚レベルで捉える",
    jobs: ["プロダクトデザイン","インタラクション","ゲームUI","車UX","家具","医療UX"],
    strengthText: "「触った感覚」「使い心地」が分かる。",
  },
  {
    axes: ["abstract", "atmosphere"],
    key: "airConceptualizer",
    title: "空気概念者",
    description: "空気感や時代性を概念として理解する",
    jobs: ["トレンド分析","ブランド戦略","クリエイティブディレクター","カルチャー編集","広告企画","メディア戦略"],
    strengthText: "時代の空気を概念化できる。",
  },
] as const;

const personalityLongDescriptions: Record<string, string> = {
  flowObserver: `導線観測者は、人そのものよりも「人の流れ」を見ている人格です。誰がどこへ向かい、どこで止まり、どこで迷い、どこに引き寄せられるのかを無意識に観察しています。街を歩いていても、店の入口の配置や、人が自然に集まる場所に目が向きます。会話の中ですら、「この話題になると人の視線が移動する」「ここで空気が流れた」と感じ取っています。
このタイプは、空間やUIを単なる見た目ではなく、“行動を誘導する構造”として捉えています。そのため、UX設計や展示、イベント構成、店舗レイアウトなどで強みを発揮します。本人は感覚で理解していることが多く、「なんとなくここがおかしい」と感じたことが、実際に人の動線問題であることがよくあります。静かに全体を見ているタイプであり、人間関係の中心に立つより、全体構造を後ろから制御することに適性があります。`,

conceptEditor:`概念編集者は、曖昧な思想や感覚を“理解できる構造”へ変換する人格です。人の話を聞くと、頭の中で自然に整理が始まり、「つまりこういうことですね」と骨格化してしまいます。断片的な情報を繋ぎ、言葉になっていない思想を整理し直す能力に長けています。
このタイプは、情報を増やすよりも“不要なものを削ぎ落として本質を残す”ことを得意とします。そのため、ブランド設計、思想整理、コンセプト設計、ネーミングなどに強い適性があります。感情より構造に意識が向くため、議論の熱量より論理的な整合性を優先する傾向があります。一方で、人の熱意や衝動を整理しすぎてしまい、冷たく見られることもあります。本人は世界を「理解可能な形にしたい」という欲求で動いています。`,

 behaviorObserver: `行動観測者は、人間の“無意識の癖”を異常な精度で観察する人格です。話し方や表情よりも、指の動き、視線、歩き方、スマホの持ち方など、本人すら意識していない行動パターンに強く反応します。
このタイプは、「人は言葉ではなく行動で本音を表す」と感じています。そのため、アンケートや建前よりも、“実際にどう動いたか”を重視します。UXやマーケティング分野では非常に強力で、「このボタンは押されない」「ここで離脱する」と直感的に理解します。人を観察対象として見続けるため、本人は人混みにいてもどこか客観的で、常に一歩引いて世界を見ています。分析力が高い反面、人を“データ”として見すぎてしまい、人間関係に距離が生まれることがあります。`,

temperatureSensor:`温度感知者は、空気の“感情温度”を身体感覚で受け取る人格です。言葉ではなく、場の湿度、静けさ、距離感、呼吸感のようなものを感じています。誰かが怒っていることを表情より先に察知したり、場の緊張感を肌で理解したりします。
このタイプにとって、空間は単なる場所ではなく、「感情が漂う環境」です。そのため、音、光、匂い、余白、人との距離感に強く影響を受けます。優しく共感性が高い反面、周囲の感情を受け取りすぎて疲弊しやすい特徴があります。人混みや緊張感の強い場所に長時間いると、精神的に消耗してしまいます。しかしその繊細さゆえに、人の気持ちを自然に察し、安心できる空気を作る力を持っています。`,

contextReader:`文脈解読者は、「なぜそうなったのか」という背景を異常な深さで掘り下げる人格です。このタイプは、表面の言葉だけを見ません。その発言が生まれた歴史、関係性、空気、文化的背景まで読み取ろうとします。
たとえば作品を見るときも、「この演出はなぜ必要だったのか」「この言葉は何への反発なのか」を考え続けます。そのため、文化、思想、歴史、ブランドの背景理解に非常に強い適性があります。一方で、単純な説明や浅い解釈には強い違和感を覚えます。常に裏側を読み解こうとするため、考え込みやすく、結論にたどり着くまで時間がかかることもあります。しかし、他人が見落とす“本当の意味”を掘り当てる能力を持っています。`,

noiseObserver:`違和感探知者は、「普通の中のズレ」を感知する人格です。1pxのズレ、会話の微妙な間、声色の変化、空気の歪みなど、人が気付かない微細なノイズに反応します。
このタイプは、世界を“正常か異常か”という感覚で見ています。そのため、デバッグ能力や異常検知能力に優れています。「なんか変」という感覚が非常に鋭く、後から問題が発覚すると「やっぱり」となることが多いです。神経質に見られることもありますが、本人は無意識に違和感を拾ってしまっているだけです。気付きすぎるため疲労しやすく、常に脳が警戒状態になりやすい傾向があります。`,

airArchitect:`空気構築者は、場の雰囲気そのものを設計する人格です。このタイプは、「何を作るか」より先に、「どんな空気を作るか」を考えています。
店舗、ブランド、イベント、SNS、会話の場など、あらゆる空間を“空気”として設計します。光、余白、音、距離感、言葉選びなどを統合し、人が自然にその世界へ没入する環境を作ります。本人は派手ではありませんが、その場の雰囲気を静かに支配しています。人を直接動かすというより、「その気になる空気」を作ることに長けています。実務の細部よりも全体の世界観を優先しやすく、空気を壊す存在に強いストレスを感じます。`,

sensoryEditor:`感覚編集者は、“美しさ”や“気持ちよさ”を整理する人格です。このタイプは、色、質感、音、余白、リズムなどを無意識に調律しています。「なんか綺麗」「なんか気持ちいい」を、偶然ではなく再現可能な形へ整えていきます。
ノイズを削り、感覚の純度を高める能力が高く、UI、映像、服、空間などの統一感づくりに強い適性があります。本人は感覚的に動いているように見えて、実際は非常に構造的です。一方で、美意識が高いため、粗さや雑さに強いストレスを感じます。「あと少し整えたい」が終わらず、完成への執着が強くなりやすい人格です。`,

behaviorDirector:`行動演出者は、人を“動きたくなる状態”へ導く人格です。このタイプは、空気、熱量、期待感を使って、人の行動を自然に誘導します。
単なる説明ではなく、「参加したい」「押したい」「試したい」と思わせる雰囲気作りに優れています。イベント、広告、SNS、接客などで強い力を発揮し、人の感情を盛り上げることが得意です。本人自身も熱量が高く、周囲を巻き込む力があります。ただし、勢いを優先しすぎると空回りすることがあり、静かな環境や感情の薄い場ではエネルギーを失いやすい特徴があります。`,

conceptSensor:`概念感知者は、思想や哲学を“感覚”として理解する人格です。このタイプは、言葉になる前の空気やイメージを感じ取っています。
普通の人が論理で理解するものを、この人格は「感触」で理解します。そのため、詩、芸術、世界観、哲学との相性が非常に良く、説明不能な直感を持っています。本人も「なぜ分かるのか説明できない」ことが多く、周囲から不思議な存在に見られます。現実的な説明や具体化は苦手ですが、誰よりも深い“感覚的理解”を持っています。`,

airObserver:`空気観測者は、場の変化を“監視”するように観測する人格です。温度感知者が空気を感じるタイプだとすれば、この人格は空気の変化量を測定しているタイプです。
誰が疲れているか、誰が浮いているか、会話の温度がどこで下がったかを瞬時に察知します。本人は無意識に周囲をスキャンし続けており、集団崩壊の兆候や不穏な空気に非常に敏感です。そのため、組織の危機察知能力に優れています。しかし常に周囲を見続けるため神経疲労が激しく、人間関係の中で消耗しやすい人格でもあります。`,

uxReader:`UX解読者は、人間行動の“原理”を理解しようとする人格です。このタイプは、「なぜ人はこれを使いやすいと感じるのか」を構造レベルで考えています。
単なるUI改善ではなく、人間心理、認知、行動導線、感情変化を抽象化して理解しようとします。そのため、UXを“思想”として捉えています。非常に論理的で本質思考ですが、感情演出や勢いだけの空気には乗りにくい特徴があります。世界をシステムとして理解しようとする、理論型の人格です。`,

obsessiveBuilder:`執着構築者は、異常なまでのこだわりで完成度を追求する人格です。このタイプは、「まだ良くできる」が止まりません。
UI、コード、配置、構造、品質などを極限まで磨き込みます。本人の中には理想形が存在しており、それに近づけるためなら時間を惜しみません。職人気質で、一人で黙々と積み上げることに強さがあります。しかし、終わりの基準が非常に高いため、永遠に完成しないことがあります。他人から見ると狂気的な執着ですが、本人にとっては“納得できる形”に近づけているだけなのです。`,

experienceSensor:`体験感知者は、UXを“身体感覚”として理解する人格です。このタイプは、「押した時の感触」「動いた時の気持ちよさ」「触れた瞬間の違和感」を非常に強く感じます。
ゲーム、デバイス、UI、空間などにおいて、“身体がどう反応するか”を基準に世界を見ています。理論ではなく、実際の感覚を重視するため、「なんか気持ちいい」が極めて重要です。感覚優位なため、論理説明は苦手ですが、体験設計の精度は非常に高い人格です。`,

airConceptualizer:`空気概念者は、“時代の空気”を概念として理解する人格です。このタイプは、「今なぜこれが流行るのか」「なぜこの雰囲気が支持されるのか」を感覚ではなく、思想として捉えています。
トレンドを表面的な流行ではなく、“時代の欲求”として読み解きます。そのため、文化分析や未来予測に強い適性があります。本人は常に時代の流れを考えており、世界の空気変化を哲学として見ています。ただし、抽象思考が強すぎるため、具体的な実務や現実処理が遅れやすい特徴があります。それでも、この人格は「次の時代の空気」を最も早く察知する存在です。`,

};



const keywordMap: Record<string, Axis> = {
  余白: "sensory",
  色彩: "atmosphere",
  色: "atmosphere",
  導線: "ux",
  迷い: "ux",
  不安: "ux",
  順番: "structure",
  配置: "structure",
  整理: "structure",
  世界観: "abstract",
  文脈: "abstract",
  コンセプト: "abstract",
  密度: "sensory",
  間: "sensory",
  リズム: "sensory",
  違和感: "obsession",
  ズレ: "obsession",
  ノイズ: "obsession",
};

const experienceOptions = [
  "未経験",
  "1年未満",
  "1年以上",
  "3年以上",
  "5年以上",
  "10年以上",
  "20年以上",
];


function getChoicePoint(phase: "rank" | "remove" | "add", index: number) {
  if (phase === "rank") {
    return [2, 1, 1][index] ?? 0;
  }

  if (phase === "add") {
    return [2, 2, 2][index] ?? 0;
  }

  return 0;
}

function calculateScores(records: AnswerRecord[]) {
  const scores: Record<Axis, number> = {
    structure: 0,
    ux: 0,
    atmosphere: 0,
    abstract: 0,
    sensory: 0,
    obsession: 0,
    dummy: 0,
  };

  records.forEach((a) => {
   // Phase1
  if (a.phase === "rank" && a.rankedChoices) {
    a.rankedChoices.forEach((choice, index) => {
      scores[choice.axis] += getChoicePoint(a.phase, index);
    });
  }

  // Phase2
  if (a.phase === "remove" && a.rankedChoices) {

    const allChoices =
      observationQuestions.find((q) => q.id === a.questionId)?.choices ?? [];

    const unselected = allChoices.filter(
      (c) =>
        !a.rankedChoices?.some((selected) => selected.text === c.text)
    );

    unselected.forEach((choice) => {
      scores[choice.axis] += 1;
    });
  }

    if (a.phase === "add" && a.mappedAxes) {
      a.mappedAxes.forEach((axis, index) => {
        scores[axis] += getChoicePoint(a.phase, index);
      });
    }
  });

  return scores;
}




export default function Page() {


const mainButtonClass =
  "rounded-full bg-[#2a2633] text-white py-3 text-lg font-semibold  active:scale-95 disabled:opacity-50"; 

const fullButtonClass = `w-full ${mainButtonClass}`;


const coverButtonClass =
  `rounded-full bg-[#2a2633] text-white py-3 font-semibold  active:scale-95 disabled:opacity-50 absolute left-1/2 -translate-x-1/2 bottom-[120px] w-[50%] py-3 text-xs`;


const [phase, setPhase] = useState<Phase>("cover");


  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    age: "",
    experience: "",
  });

  const [sessionId, setSessionId] = useState("");
  const [step, setStep] = useState(0);


  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, [phase, step]);

  const [ranked, setRanked] = useState<ObservationChoice[]>([]);



  const [selectedAdds, setSelectedAdds] = useState<string[]>([]);

  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [aiComment, setAiComment] = useState<AiComment | null>(null);
  const [saving, setSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPage, setMenuPage] = useState<"about" | "types">("about");

  const [introPhase, setIntroPhase] = useState<1 | 2 | 3>(1);

  const current = observationQuestions[step];

  const analysis = useMemo(() => {
    const scores = calculateScores(answers);

    const aiAdjustments = aiComment?.adjustments ?? {};

    const normalized = Object.fromEntries(
      Object.entries(scores).map(([key, value]) => {
        const axis = key as Axis;

        if (axis === "dummy") {
          return [axis, value];
        }

        const rawAdjust = aiAdjustments[axis] ?? 0;
        const adjust = Math.max(0, Math.min(4, rawAdjust));

        return [axis, Math.max(0, Math.round(value + adjust))];
      })
    ) as Record<Axis, number>;

    const sorted = Object.entries(normalized)
  .filter(([key]) => key !== "dummy")
  .sort((a, b) => b[1] - a[1]);

    const topAxis = sorted[0]?.[0] as Axis;
    const topTwoAxes = sorted.slice(0, 2).map(([axis]) => axis as Axis);


  const realScores = Object.entries(normalized).filter(
    ([key]) => key !== "dummy"
  );

  const lowAxisCount = realScores.filter(([, v]) => v <= 12).length;
  const highAxisCount = realScores.filter(([, v]) => v >= 30).length;
  const superAxisCount = realScores.filter(([, v]) => v >= 30).length;

    let level = "初級";

    if (lowAxisCount === 0) {
      level =
        superAxisCount >= 2
          ? "超級"
          : highAxisCount >= 1
          ? "上級"
          : "中級";
    }



    const personality =
      personalityMap.find((p) =>
        p.axes.every((axis) => topTwoAxes.includes(axis as Axis))
      ) ?? personalityMap[0];

    const title =
      level === "超級"
        ? `超${personality.title}`
        : personality.title;

    return {
      scores: normalized,
      topAxis,
      topTwoAxes,
      topType:
        topAxis === "dummy"
          ? "未分類"
          : labels[topAxis],
      level,
      title,
      personality,
      characterImage: `/${personality.axes.join("-")}.png`,
      lowAxisCount,
      highAxisCount,
      superAxisCount,
      total: Object.values(normalized).reduce((a, b) => a + b, 0),
    };
  }, [answers, aiComment]);

  function getTemporaryLevel(
    records: AnswerRecord[],
    adjustments: AiComment["adjustments"] = {}
  ) {
    const scores: Record<Axis, number> = {
      structure: 0,
      ux: 0,
      atmosphere: 0,
      abstract: 0,
      sensory: 0,
      obsession: 0,
      dummy: 0,
    };

    records.forEach((a) => {
      if (a.phase === "rank" && a.rankedChoices) {
        a.rankedChoices.forEach((choice, index) => {
          const point = [2, 1, 1][index] ?? 0;
          scores[choice.axis] += point;
        });
      }

      if (a.phase === "remove" && a.rankedChoices) {
        a.rankedChoices.forEach((choice, index) => {
          const point = [2, 1, 1][index] ?? 0;
          scores[choice.axis] += point;
        });
      }
    });

    const adjustedScores = Object.fromEntries(
      Object.entries(scores).map(([key, value]) => {
        const axis = key as Axis;

        if (axis === "dummy") {
          return [axis, value];
        }

        const adjust = adjustments[axis] ?? 0;

        return [axis, Math.max(0, Math.round(value + adjust))];
      })
    ) as Record<Axis, number>;

    const values = Object.values(adjustedScores);
    const total = values.reduce((a, b) => a + b, 0);
    const topScore = Math.max(...values);

    let level = "初級";

    if (total >= 12) {
      level = "中級";
    }

    if (total >= 20 && topScore >= 8) {
      level = "上級";
    }

    return level;
  }

  async function start() {
    if (!profile.name || !profile.email || !profile.age || !profile.experience) {
      alert("名前・メールアドレス・年代・経歴を入力してください");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        name: profile.name,
        email: profile.email,
        age: profile.age,
        designer_experience: profile.experience,
        phase: "observation",
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error(error);
      alert("保存に失敗しました");
      return;
    }

    setSessionId(data.id);
    setIntroPhase(1);
    setPhase("phaseIntro");
  }

  function toggleRank(choice: ObservationChoice) {
    setRanked((prev) => {
      const exists = prev.find((c) => c.text === choice.text);

      if (exists) {
        return prev.filter((c) => c.text !== choice.text);
      }

      if (prev.length >= 3) return prev;

      return [...prev, choice];
    });
  }

  

  async function next() {
  if (!sessionId) return;

  let record: AnswerRecord | null = null;

  if (current.phase === "rank") {
    if (ranked.length !== 3) {
      alert("気になるものを3つ選んでください");
      return;
    }

    record = {
      questionId: current.id,
      phase: "rank",
      rankedChoices: ranked,
    };
  }

  if (current.phase === "remove") {
    if (ranked.length !== 3) {
      alert("不要だと思うものを3つ選んでください");
      return;
    }

    record = {
      questionId: current.id,
      phase: "remove",
      rankedChoices: ranked,
    };
  }

  if (current.phase === "add") {
    if (selectedAdds.length !== 3) {
      alert("3つ選択してください");
      return;
    }

    record = {
      questionId: current.id,
      phase: "add",
      addedWords: selectedAdds,
      mappedAxes:
      current.choices
        ?.filter((c) => selectedAdds.includes(c.text))
        .map((c) => c.axis) ?? [],
    };
  }

  if (!record) return;

  await supabase.from("responses").insert({
    session_id: sessionId,
    question_id: current.id,


    choice_text:
      current.phase === "add"
        ? selectedAdds.join(" / ")
        : ranked.map((c) => c.text).join(" / "),
    tags:
      current.phase === "add"
        ? current.choices
            ?.filter((c) => selectedAdds.includes(c.text))
            .map((c) => c.axis) ?? []
        : ranked.map((c) => c.axis),


    rank: null,
    skipped: false,
    unselected_choices: current.choices ?? [],
    phase: current.phase,
  });

  const nextAnswers = [...answers, record];

  setAnswers(nextAnswers);
  setRanked([]);
  setSelectedAdds([]);




  // Phase1終了 → Phase2扉
  if (
    current.phase === "rank" &&
    observationQuestions[step + 1]?.phase === "remove"
  ) {
    setIntroPhase(2);
    setPhase("phaseIntro");
    setStep((s) => s + 1);
    return;
  }
  
  // Phase2終了 → Phase3扉
  if (
    current.phase === "remove" &&
    observationQuestions[step + 1]?.phase === "add"
  ) {
    setIntroPhase(3);
    setPhase("phaseIntro");
    setStep((s) => s + 1);
    return;
  }


  if (step < observationQuestions.length - 1) {
    setStep((s) => s + 1);
    return;
  }



  setPhase("analyzing");

  // ① AI加点減点を取得
  const adjustmentRes = await fetch("/api/analyze-adjustment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile,
      answers: nextAnswers,
    }),
  });

  let adjustments: Record<RealAxis, number> = {
    structure: 0,
    ux: 0,
    atmosphere: 0,
    abstract: 0,
    sensory: 0,
    obsession: 0,
  };

  if (adjustmentRes.ok) {
    const adjustmentData = await adjustmentRes.json();
    adjustments = {
      ...adjustments,
      ...(adjustmentData.adjustments ?? {}),
    };
  }

  // ② AI補正込みで最終分析をローカル計算
  const baseScores = calculateScores(nextAnswers);

  const finalScores = Object.fromEntries(
    Object.entries(baseScores).map(([key, value]) => {
      const axis = key as Axis;

      if (axis === "dummy") {
        return [axis, value];
      }

      const adjust = Math.max(0, Math.min(4, adjustments[axis] ?? 0));

      return [axis, Math.max(0, Math.round(value + adjust))];
    })
  ) as Record<Axis, number>;

  const sorted = Object.entries(finalScores)
  .filter(([key]) => key !== "dummy")
  .sort((a, b) => b[1] - a[1]);

 const topAxis = sorted[0][0] as RealAxis;
  const topTwoAxes = sorted.slice(0, 2).map(([axis]) => axis as RealAxis);

  const realScores = Object.entries(finalScores).filter(
      ([key]) => key !== "dummy"
  );

  const lowAxisCount = realScores.filter(([, v]) => v <= 12).length;
  const highAxisCount = realScores.filter(([, v]) => v >= 30).length;
  const superAxisCount = realScores.filter(([, v]) => v >= 30).length;

  let finalLevel = "初級";

  if (lowAxisCount === 0) {
    finalLevel =
      superAxisCount >= 2
        ? "超級"
        : highAxisCount >= 1
        ? "上級"
        : "中級";
  }


  const personality =
    personalityMap.find((p) =>
      p.axes.every((axis) => topTwoAxes.includes(axis as RealAxis))
    ) ?? personalityMap[0];

  const finalTitle =
    finalLevel === "超級" ? `超${personality.title}` : personality.title;

  const finalTopType = labels[topAxis as RealAxis];
  const finalTotal = realScores.reduce((sum, [, value]) => sum + value, 0);

  // ③ 確定結果を使って総評を生成
  const commentRes = await fetch("/api/analyze-comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      profile,
      answers: nextAnswers,
      fixedScores: finalScores,
      fixedLevel: finalLevel,
      topType: finalTopType,
      title: finalTitle,
      adjustments,
    }),
  });

  if (commentRes.ok) {
    const commentData = await commentRes.json();

    setAiComment({
      ...commentData,
      adjustments,
    });
  } else {
    setAiComment({
      summary: "AI総評の生成に失敗しました",
      strength: "",
      risk: "",
      aiNote: "",
      adjustments,
    });
  }

  // ④ DB保存も確定結果で保存
  await supabase.from("results").insert({
    session_id: sessionId,
    top_type: finalTopType,
    level: finalLevel,
    design_cognition_score: Math.round(finalTotal),
    is_super: finalLevel === "超級",
  });

  setPhase("result");



}

if (phase === "cover") {
  return (
    <div className="w-screen h-[100dvh] overflow-hidden bg-black relative">
      <img
        src="/top-in.png"
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none"
      />

      {/* TOP右上のinfo */}
      <button
        type="button"
        onClick={() => setShowMenu(true)}
        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-white/30 bg-white/80 text-neutral-700 flex items-center justify-center"
      >
        ☰
      </button>

      <button
        type="button"
        onClick={() => setPhase("profile")}
        className={coverButtonClass}
      >
        解 析 を 開 始 す る
      </button>


      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-wide text-gray-500 whitespace-nowrap">  
       © 2026 Graphic Center Niigata / Haga Masaaki
      </p>

      {showMenu && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div
            className="min-h-[100dvh] bg-cover bg-center px-5 py-6"
            style={{ backgroundImage: "url('/bg.png')" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="font-bold text-lg"></div>

              <button
                onClick={() => setShowMenu(false)}
                className="w-10 h-10 rounded-full bg-black text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                onClick={() => setMenuPage("about")}
                className={`rounded-full py-3 text-sm font-semibold ${
                  menuPage === "about"
                    ? "bg-[#2a2633] text-white"
                    : "bg-white border border-neutral-200 text-neutral-600"
                }`}
              >
                認知解析システム
              </button>

              <button
                onClick={() => setMenuPage("types")}
                className={`rounded-full py-3 text-sm font-semibold ${
                  menuPage === "types"
                    ? "bg-[#2a2633] text-white"
                    : "bg-white border border-neutral-200 text-neutral-600"
                }`}
              >
                15人の認知者
              </button>
            </div>

            {menuPage === "about" && (
            <div className="space-y-5">
              <h2 className="text-3xl font-bold leading-tight">
                認知解析システムについて
              </h2>

              <p className="text-neutral-600 leading-8">
                このシステムは、あなたが無意識に「何を見てしまうのか」を解析するためのものです。
                デザインの上手さや技術力を測るものではありません。
              </p>

              <div className="rounded-2xl bg-white/80 border border-neutral-200 p-5 space-y-4">
                <div className="font-bold">解析する6つの認知軸</div>

                <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600">
                  <div>情報構築</div>
                  <div>UX認知</div>
                  <div>空気演出</div>
                  <div>抽象理解</div>
                  <div>感覚認知</div>
                  <div>観察執着</div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/80 border border-neutral-200 p-5 space-y-4">
                <div className="font-bold">15人の認知者</div>

                <p className="text-sm text-neutral-500 leading-7">
                  6つの認知軸の組み合わせから、あなたの認知タイプを15種類の人格として判定します。
                  これは職業適性だけでなく、あなたが世界をどう見ているかを可視化するものです。
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 border border-neutral-200 p-5 space-y-4">
                <div className="font-bold">上級・超級判定</div>

                <p className="text-sm text-neutral-500 leading-7">
                  認知の欠損が少なく、複数の認知軸が強く出た場合、
                  上級または超級として判定されます。
                  上級・超級には、認知解析証明ワッペンが表示されます。
                  営業資料・SNS・ポートフォリオなど、
                  自由に使用していただいて問題ありません。
                  解析、ワッペンのご利用は無料です。
                  一般的には、初級か中級判定です。
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 border border-neutral-200 p-5 space-y-4">
                <div className="font-bold">入力について</div>

                <p className="text-sm text-neutral-500 leading-7 whitespace-pre-line">
                  名前・メールアドレス・年代・デザイン歴を入力してください。
                  名前はニックネームでも問題ありません。
                  上級以上になるとワッペンが表示されます。
                  ここに入力された名前・メールアドレスが表示されます。

                  年代は、できるだけ実年齢に近いものを選択してください。

                  デザイン歴は、職業デザイナーに限りません。
                  趣味・創作活動・設計・ものづくり・SNS運用など、
                  「デザイン的に考えた経験」も含めて入力して構いません。
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 border border-neutral-200 p-5 space-y-4">
                <div className="font-bold">解析について</div>

                <p className="text-sm text-neutral-500 leading-7">
                  解析開始後は、前の問題へ戻ることはできません。
                  考え込みすぎず、直感的に選択してください。
                </p>
              </div>

              <div className="rounded-2xl bg-white/80 border border-neutral-200 p-5 space-y-4">
                <div className="font-bold">プライバシーについて</div>

                <p className="text-sm text-neutral-500 leading-7">
                  入力されたメールアドレスは、
                  認知解析システム以外の目的で使用されることはありません。
                </p>
              </div>


            </div>
          )}


           {menuPage === "types" && (
            <div className="space-y-4">
              {personalityMap.map((p) => (
                <div
                  key={p.key}
                  className="rounded-3xl overflow-hidden bg-white/80 border border-neutral-200"
                >
                  <img
                    src={`/${p.axes.join("-")}.png`}
                    alt={p.title}
                    className="w-full h-auto block"
                  />

                  <div className="p-5">
                    <div className="font-bold text-2xl">{p.title}</div>

                    <div className="text-xs text-neutral-400 mt-1">
                      {p.axes.join(" + ")}
                    </div>

                    <p className="text-sm text-neutral-600 leading-7 mt-3 whitespace-pre-line">
                      {personalityLongDescriptions[p.key] ?? p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )} 

          <div className="pt-6 pb-2 text-center">
                      <p className="text-[10px] tracking-wide text-gray-400 whitespace-nowrap">
                        © 2026 Graphic Center Niigata / Haga Masaaki
                      </p>
          </div>


          </div>
        </div>
      )}
    </div>
  );
}

  const selectedIndex = (choice: ObservationChoice) =>
    ranked.findIndex((c) => c.text === choice.text);



  if (phase === "profile") {
    return (
        <div className="min-h-[100dvh] w-screen overflow-x-hidden">
  <div
    className="w-screen min-h-[100dvh] px-5 py-6 space-y-8 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg.png')" }}
        >
          <div className="flex items-center justify-between">

            <button
              onClick={() => setPhase("cover")}
              className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-xl text-neutral-700"
            >
              ←
            </button>

            <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm">
              <Brain className="w-4 h-4" />
              Design Cognitive Analysis
            </div>

          </div>

          <h1 className="text-5xl font-bold leading-none tracking-tight">
            Design
            <br />
            Cognitive
            <br />
            Analysis
          </h1>

          <p className="text-neutral-500 leading-7">
            あなたの「認知構造」をAIが解析します
          </p>

          <div className="space-y-4">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => 
                setProfile({ ...profile, name: e.target.value })
              }
              placeholder="名前（ニックネーム可）"
              className="w-full rounded-2xl bg-neutral-100 border border-neutral-200 px-4 py-4 outline-none"
            />   

            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="メールアドレス"
              className="w-full rounded-2xl bg-neutral-100 border border-neutral-200 px-4 py-4 outline-none"
            />

            <select
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              className="w-full rounded-2xl bg-neutral-100 border border-neutral-200 px-4 py-4 outline-none text-neutral-500 appearance-none"
            >
              <option value="">年代を選択</option>
              {[
                "0代",
                "10代",
                "20代",
                "30代",
                "40代",
                "50代",
                "60代",
                "70代",
                "80代",
                "90代",
                "100代以上",
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>

            <select
              value={profile.experience}
              onChange={(e) =>
                setProfile({ ...profile, experience: e.target.value })
              }
              className="w-full rounded-2xl bg-neutral-100 border border-neutral-200 px-4 py-4 outline-none text-neutral-500 appearance-none"
            >
              <option value="">デザイン経験</option>
              {experienceOptions.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          <button
            onClick={start}
            disabled={saving}
            className={fullButtonClass}
          >
            {saving ? "保存中..." : "解 析 を は じ め る"}
          </button>
        </div>






      </div>
    );
  }




if (phase === "phaseIntro") {
  return (
    <div
      className="w-screen min-h-[100dvh] overflow-x-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="min-h-[100dvh] px-8 py-8 space-y-8 text-center flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm mx-auto">
          <Brain className="w-4 h-4" />
          Cognitive Phase
        </div>

        {introPhase === 1 && (
          <>
            <h1 className="text-2xl font-bold tracking-wide text-neutral-400">
              Phase 1
            </h1>

            <p className="text-black leading-tight text-2xl font-bold">
              必要だと思うものを
              <br />
              3つ選択してください
            </p>
          </>
        )}

        {introPhase === 2 && (
          <>
            <h1 className="text-2xl font-bold tracking-wide text-neutral-400">
              Phase 2
            </h1>

            <p className="text-black leading-tight text-2xl font-bold">
              意識しないものを
              <br />
              3つ選択してください
            </p>
          </>
        )}

        {introPhase === 3 && (
          <>
            <h1 className="text-2xl font-bold tracking-wide text-neutral-400">
              Phase 3
            </h1>

            <p className="text-black leading-tight text-2xl font-bold">
              必要だと思うものを
              <br />
              3つ選択してください
            </p>
          </>
        )}

        <button
          onClick={() => setPhase("question")}
          className={fullButtonClass}
        >
          は じ め る
        </button>
      </div>
    </div>
  );
}




  if (phase === "analyzing") {
    return (
      <div className="min-h-screen bg-neutral-100 px-5 py-10 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 p-6 shadow-lg space-y-6 text-center">
          <div className="mx-auto w-14 h-14 rounded-full border-4 border-neutral-200 border-t-black animate-spin" />

          <h1 className="text-3xl font-bold leading-tight">
            AI認知解析を実行しています
          </h1>

          <p className="text-neutral-500 leading-7">
            選択・削除・追加ワードから認知構造を照合しています。
          </p>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="min-h-[100dvh] w-screen overflow-x-hidden">
  <div
    className="w-screen min-h-[100dvh] px-5 py-6 space-y-8 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg.png')" }}
        >      <div className="inline-flex items-center rounded-full bg-black text-white px-4 py-2 text-sm">
            AI Cognitive Analysis Report
          </div>

          <div>
            <p className="text-neutral-400">あなたは</p>

            <div className="space-y-2 mt-1">
              <h1 className="text-5xl font-bold leading-tight">
                {analysis.title}
              </h1>

              <div className="space-y-1 text-lg text-neutral-500 leading-7">
                {analysis.topTwoAxes.map((axis) => (
                  <div key={axis}>
                    {labels[axis as RealAxis]}認知 / {analysis.level}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <img
            src={analysis.characterImage}
            alt={analysis.title}
            className="w-full rounded-3xl object-cover"
          />

          {(analysis.level === "上級" || analysis.level === "超級") && (
                      /* 1. aspect-[4/3]（または実画像の縦横比）を指定してコンテナの形をワッペンに完全に固定します。
                        2. 縦方向の中央揃え（justify-center）を活かすため固定の mt-16 などを排除します。
                      */
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-3xl">

                        <img
                          src={
                            analysis.level === "超級"
                              ? "/wappen-super.png"
                              : "/wappen-advanced.png"
                          }
                          alt="Cognitive Analysis Certificate"
                          className="
                            absolute
                            left-1/2
                            top-1/2
                            -translate-x-1/2
                            -translate-y-1/2
                            w-[120%]
                            max-w-none
                            object-contain
                            select-none
                            pointer-events-none
                          "
                        />

                        {/* テキスト全体を囲むコンテナ。
                          上下左右を完全に中央揃えにし、ワッペンの枠内に収まるよう padding(p-6) と y軸の微調整（-translate-y-2など）を行います。
                        */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 -translate-y-1 leading-[1]">

                          {/* 名前 */}
                          <div className="mt-2 text-base font-bold text-black tracking-wide max-w-[90%] truncate">
                            {profile.name.length > 10 ? `${profile.name.slice(0, 10)}…` : profile.name}
                          </div>

                          {/* メールアドレス */}
                          <div className="text-[11px] text-black/70 max-w-[90%] break-all">
                            {profile.email.length > 32 ? `${profile.email.slice(0, 32)}…` : profile.email}
                          </div>

                          {/* 診断タイトル */}
                          <div className="text-base font-medium text-black px-3 rounded-full mt-[2px]">
                            {analysis.title}
                          </div>

                          {/* レベル */}
                          <div className="text-xs font-black tracking-[0.18em] text-black">
                            {analysis.level === "超級" ? "SUPER" : "ADVANCED"}
                          </div>

                        </div>
                      </div>
                    )}









          {aiComment && (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="w-4 h-4" />
                AI監査コメント
              </div>

              <p className="text-neutral-600 leading-7">{aiComment.summary}</p>
              <p className="text-sm text-neutral-500 leading-6">
                {aiComment.strength}
              </p>
              <p className="text-sm text-neutral-500 leading-6">
                {aiComment.risk}
              </p>
              <p className="text-sm text-neutral-500 leading-6">
                {aiComment.aiNote}
              </p>
            </div>
          )}


          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
            <div className="font-bold">適職・相性のよい領域</div>

            <div className="flex flex-wrap gap-2">
              {analysis.personality.jobs.map((job) => (
                <span
                  key={job}
                  className="rounded-full bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-600"
                >
                  {job}
                </span>
              ))}
            </div>

            <p className="text-sm text-neutral-500 leading-6">
              {analysis.personality.strengthText}
            </p>
          </div>


          



          <div className="grid grid-cols-2 gap-3">
              {Object.entries(analysis.scores)
                .filter(([key]) => key !== "dummy")
                .map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
              >
                <div className="text-sm text-neutral-500">
                  {labels[key as RealAxis]}
                </div>

                <div className="text-2xl font-bold">{value}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              window.history.replaceState(null, "", "/");

              window.scrollTo(0, 0);

              setPhase("cover");
              setStep(0);
              setRanked([]);
              setAnswers([]);
              setAiComment(null);
              setSessionId("");
              setProfile({
                name: "",
                email: "",
                age: "",
                experience: "",
              });
            }}
            className="w-full rounded-full border border-neutral-200 bg-white py-4 text-sm text-neutral-600 hover:bg-neutral-50 transition"
          >
            TOPへ戻る
          </button>

          <div className="pt-6 pb-2 text-center">
            <p className="text-[10px] tracking-wide text-gray-400 whitespace-nowrap">
              © 2026 Graphic Center Niigata / Haga Masaaki
            </p>
          </div>

        </div>
      </div>
    );
  }

  return (
  <div
  className="w-screen min-h-[100dvh] overflow-x-hidden bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/bg.png')" }}
>
  <div className="min-h-[100dvh] px-5 py-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm">
          <Brain className="w-4 h-4" />
          Cognitive Observation
        </div>

        <div className="mt-8 text-sm text-neutral-400">
          Question {step + 1} / {observationQuestions.length}
        </div>

        <h1 className="mt-3 text-3xl leading-tight font-bold">
          {current.title}
        </h1>

        {current.phase === "rank" && (
          <p className="mt-4 text-neutral-500 leading-7">
            気になるものを3つ選んでください。
          </p>
        )}

        {current.phase === "remove" && (
          <p className="mt-4 text-neutral-500 leading-7">
            この中で不要だと思うものを3つ選んでください。
          </p>
        )}

        {current.phase === "add" && (
          <p className="mt-4 text-neutral-500 leading-7">
            重要だと思うものを3つ選択してください。
          </p>
        )}
       
       {current.phase !== "add" ? (
  <div className="mt-8 grid grid-cols-2 gap-2">
    {current.choices?.map((choice) => {
      const index = selectedIndex(choice);
      const selected = index !== -1;

      return (
        <button
          key={choice.text}
          onClick={() => toggleRank(choice)}
          className={`w-full rounded-2xl border px-5 py-5 text-left transition ${
            selected
              ? "bg-neutral-500/50 text-black border-neutral-400"
              : "bg-neutral-50 text-neutral-900 border-neutral-200 hover:bg-neutral-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{choice.text}</span>

          </div>
        </button>
      );
    })}
  </div>
) : (
  <div className="mt-8 grid grid-cols-2 gap-2">
    {current.choices?.map((choice) => {
      const selected = selectedAdds.includes(choice.text);

      return (
        <button
          key={choice.text}
          onClick={() => {
            setSelectedAdds((prev) => {
              if (prev.includes(choice.text)) {
                return prev.filter((v) => v !== choice.text);
              }

              if (prev.length >= 3) return prev;

              return [...prev, choice.text];
            });
          }}
          className={`w-full rounded-2xl border px-5 py-5 text-left transition ${
            selected
              ? "bg-neutral-500/50 text-black border-neutral-400"
              : "bg-neutral-50 text-neutral-900 border-neutral-200 hover:bg-neutral-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{choice.text}</span>
          </div>
        </button>
      );
    })}
  </div>
)}

        <button
          onClick={next}
          disabled={saving}
          className={`mt-8 ${fullButtonClass}`}
        >
          次　へ
        </button>

    

      </div>
    </div>
  );
}