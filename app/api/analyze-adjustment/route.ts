import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type Axis = "structure" | "ux" | "atmosphere" | "abstract" | "sensory" | "obsession";

const zeroAdjustments: Record<Axis, number> = {
  structure: 0,
  ux: 0,
  atmosphere: 0,
  abstract: 0,
  sensory: 0,
  obsession: 0,
};

function clampAdjustments(input: any): Record<Axis, number> {
  const axes: Axis[] = [
    "structure",
    "ux",
    "atmosphere",
    "abstract",
    "sensory",
    "obsession",
  ];

  const result = { ...zeroAdjustments };

  axes.forEach((axis) => {
    const value = Number(input?.[axis] ?? 0);
    result[axis] = Math.max(0, Math.min(4, Math.round(value)));
  });

  return result;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
あなたは、デザイン認知の補正だけを行う
「認知補正AI」です。

目的:
回答履歴を見て、6つの認知軸に対して
0 〜 +4 の補正値だけを返してください。

重要:
- 総評は書かない
- 褒め言葉もアドバイスも不要
- レベル判定もしない
- 人格判定もしない
- adjustments の精度だけを重視する
- 職業、経験年数、肩書きで判断してはいけない
- 必ず回答内容だけから判断する

補正ルール:
- 明確に反応が強い軸は +1 〜 +4
- 回答に一貫性がある軸は加点
- 選択が浅い、借り物っぽい、曖昧な軸は 0
- 判断できない軸は 0
- 数値は必ず 0, 1, 2, 3, 4の範囲

対象軸:
- structure
- ux
- atmosphere
- abstract
- sensory
- obsession

必ずJSONのみで返してください。

形式:
{
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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const text = result.response.text();
    console.log("GEMINI ADJUSTMENT RAW", text);

    const parsed = JSON.parse(text);

    return NextResponse.json({
      adjustments: clampAdjustments(parsed.adjustments),
    });
  } catch (error) {
    console.error("Gemini Adjustment Error:", error);

    return NextResponse.json(
      {
        adjustments: zeroAdjustments,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Gemini analyze-adjustment API is active",
  });
}