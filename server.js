
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 첫 화면 연결
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// AI 퀴즈 생성
app.post("/api/quiz", async (req, res) => {
  try {
    const { grade, subject, topic } = req.body;

    if (!grade || !subject || !topic) {
      return res.status(400).json({
        error: "학년, 과목, 주제를 입력해 주세요."
      });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 대한민국 초등학교 교사입니다.

초등학생의 학년과 교과 수준에 맞는
객관식 퀴즈 5개를 만드세요.

조건:
1. 초등학교 교육과정 수준에 맞게 출제합니다.
2. 각 문제에는 보기 4개가 있어야 합니다.
3. 정답은 1~4 중 하나입니다.
4. 각 문제에 친절하고 정확한 해설을 제공합니다.
5. 정답 위치는 다양하게 배치합니다.
6. 반드시 JSON 객체만 반환합니다.

JSON 형식:
{
  "questions": [
    {
      "question": "문제 내용",
      "options": [
        "보기 1",
        "보기 2",
        "보기 3",
        "보기 4"
      ],
      "answer": 1,
      "explanation": "정답 해설"
    }
  ]
}`
        },
        {
          role: "user",
          content: `${grade}학년 ${subject} 과목의
'${topic}' 주제로 객관식 퀴즈 5개를 만들어 주세요.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const quiz = JSON.parse(
      response.choices[0].message.content
    );

    res.json(quiz);

  } catch (error) {
    console.error("퀴즈 생성 오류:", error);

    res.status(500).json({
      error: "퀴즈 생성 중 오류가 발생했습니다."
    });
  }
});

// Vercel 서버리스 환경 지원
export default app;

// 로컬 실행 환경
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`서버 실행 중: ${PORT}`);
  });
}
