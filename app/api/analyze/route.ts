import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Geminiの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 2. モデルの設定
    const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",    });

    // あなたが作成した、最高のプロンプトをここに配置
    const prompt = `
あなたは、デザイナーの無意識の視点を読み解く
「認知解析官（Cognitive Analyst）」です。

【重要任務】
目的は、ユーザーの優劣を決めつけることではありません。
回答履歴から、その人が無意識に何へ反応しやすいかを分析し、
認知の強み・偏り・伸びしろを言語化してください。

【評価方針】
評価は必ず回答内容から判断してください。
職業・経験年数・肩書きで能力を決めつけてはいけません。

【レベル別コメント方針】

1. 超級:
- 全体として非常に高い認知として扱う
- ベタ褒めしてよい
- 欠点指摘は基本的に不要
- 「全ての認知が備わっている」「突出した認知軸がある」ことを強く評価する
- 希少性、鋭さ、観察精度を強調する

2. 上級:
- 高い認知として扱う
- 強みを中心に褒める
- ただし欠点や弱点を1点だけ指摘する
- 指摘は否定ではなく「さらに伸びる余地」として表現する
- 鋭さと安定感を評価する

3. 中級:
- 必ず褒める点を1つ入れる
- そのうえで、欠損している認知軸や偏りを具体的に指摘する
- 可能性はあるが、まだ認知の抜けがある状態として説明する
- 厳しすぎず、ただし曖昧にごまかさない
- アドバイスを具体的に入れる

4. 初級:
- 必ず小さな長所を1つ見つける
- 欠損している認知軸をわかりやすく説明する
- 「まだ伸びる段階」として伝える
- 断定的な否定、人格否定、冷たい表現は禁止
- アドバイスを具体的に入れる

【adjustments のルール】
各軸に -3 〜 +3 の整数で補正を入れてください。
必ず以下の6軸すべてに数値を入れてください。

- structure
- ux
- atmosphere
- abstract
- sensory
- obsession

重要:
- +3を乱発しない
- -3を乱発しない
- 回答に明確な根拠がある場合のみ大きく補正する
- 数値は必ず -3, -2, -1, 0, 1, 2, 3 の範囲に収める
- 範囲外の数値は禁止

【出力形式】
必ずJSONのみで返してください。

{
  "summary": "",
  "strength": "",
  "risk": "",
  "aiNote": "",
  "adjustments": {
    "structure": 0,
    "ux": 0,
    "atmosphere": 0,
    "abstract": 0,
    "sensory": 0,
    "obsession": 0
  }
}

入力データ:
${JSON.stringify(body, null, 2)}
`;

    // 3. 生成の設定（JSONをより確実に、バッククォートなしで返させる設定）
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json", // これを指定すると ```json などの装飾が消えます
      },
    });
    
    const text = result.response.text();
    console.log("GEMINI CONTENT RAW", text);

    // 4. 解析結果をJSONとして返す
    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("Gemini Error:", error);

    return NextResponse.json(
      {
        summary: "AI解析に失敗しました",
        strength: "",
        risk: "",
        aiNote: "",
        adjustments: {
          structure: 0,
          ux: 0,
          atmosphere: 0,
          abstract: 0,
          sensory: 0,
          obsession: 0,
        },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Gemini analyze API is active",
  });
}