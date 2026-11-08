
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
          content: `당신은 초등학교 교사입니다.
초등학생 눈높이에 맞는 객관식 퀴즈 5개를 만드세요.
각 문제는 보기 4개, 정답 번호, 해설을 포함합니다.
반드시 JSON 객체만 반환하세요.
형식:
{
  "questions": [
    {
      "question": "문제",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "answer": 1,
      "explanation": "해설"
    }
  ]
}
answer는 1부터 4까지의 숫자입니다.`
        },
        {
          role: "user",
          content: `${grade}학년 ${subject} 과목의
'${topic}' 주제로 퀴즈 5개를 만들어 주세요.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const quiz = JSON.parse(
      response.choices[0].message.content
    );

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "퀴즈 생성 중 오류가 발생했습니다."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: ${PORT}`);
});
