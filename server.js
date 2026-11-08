
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const quizBank = [
  {
    grade: 5,
    subject: "사회",
    topic: "조선 시대의 생활",
    questions: [
      {
        question: "조선 시대에 백성들이 주로 생계를 유지한 방법은?",
        options: ["농사", "자동차 제조", "컴퓨터 개발", "우주 탐사"],
        answer: 1,
        explanation: "조선 시대에는 농업이 주요 산업이었습니다."
      },
      {
        question: "조선 시대에 사용한 문자는 무엇인가요?",
        options: ["영어", "한글", "로마자", "아라비아 문자"],
        answer: 2,
        explanation: "세종 대왕 때 훈민정음이 창제되었습니다."
      },
      {
        question: "조선 시대 양반들이 주로 공부한 학문은?",
        options: ["유교 경전", "인공지능", "항공 공학", "컴퓨터 과학"],
        answer: 1,
        explanation: "조선은 유교를 중요한 통치 이념으로 삼았습니다."
      },
      {
        question: "조선 시대 사람들이 입었던 전통 의복은?",
        options: ["정장", "우주복", "한복", "교복"],
        answer: 3,
        explanation: "조선 시대에는 신분과 상황에 따라 다양한 한복을 입었습니다."
      },
      {
        question: "조선 시대에 왕이 생활하고 나라의 일을 돌보던 곳은?",
        options: ["학교", "궁궐", "공장", "공항"],
        answer: 2,
        explanation: "궁궐은 왕과 왕실이 생활하고 국가의 중요한 일을 처리하던 곳입니다."
      }
    ]
  },
  {
    grade: 5,
    subject: "수학",
    topic: "평균과 가능성",
    questions: [
      {
        question: "4, 6, 8의 평균은?",
        options: ["5", "6", "7", "8"],
        answer: 2,
        explanation: "(4+6+8)÷3=6입니다."
      },
      {
        question: "10, 20, 30, 40의 평균은?",
        options: ["20", "25", "30", "35"],
        answer: 2,
        explanation: "네 수의 합 100을 4로 나누면 25입니다."
      },
      {
        question: "주사위에서 7이 나올 가능성은?",
        options: ["확실하다", "반반이다", "불가능하다", "높다"],
        answer: 3,
        explanation: "일반적인 주사위에는 1부터 6까지의 눈만 있습니다."
      },
      {
        question: "동전을 던질 때 앞면이 나올 가능성은?",
        options: ["불가능하다", "반반이다", "확실하다", "매우 낮다"],
        answer: 2,
        explanation: "공정한 동전이라면 앞면과 뒷면의 가능성이 같습니다."
      },
      {
        question: "5명의 점수가 10, 20, 30, 40, 50점일 때 평균은?",
        options: ["20점", "25점", "30점", "35점"],
        answer: 3,
        explanation: "점수의 합 150을 5로 나누면 30점입니다."
      }
    ]
  }
];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/quiz", (req, res) => {
  const { grade, subject, topic } = req.body || {};

  if (!grade || !subject || !topic) {
    return res.status(400).json({
      error: "학년, 과목, 주제를 입력해 주세요."
    });
  }

  const normalize = (value) =>
    String(value).replace(/\s+/g, "").toLowerCase();

  const selected = quizBank.find(
    (item) =>
      Number(grade) === item.grade &&
      normalize(subject) === normalize(item.subject) &&
      normalize(topic) === normalize(item.topic)
  );

  if (!selected) {
    return res.status(404).json({
      error: "아직 준비되지 않은 주제입니다. 5학년 사회 '조선 시대의 생활' 또는 5학년 수학 '평균과 가능성'을 선택해 주세요."
    });
  }

  const questions = [...selected.questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  res.json({ questions });
});

export default app;

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`서버 실행 중: ${PORT}`);
  });
}
