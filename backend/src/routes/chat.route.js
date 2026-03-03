import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import skillconnectContext from "../data/skillconnectContext.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fallbackAnswer(message) {
  const q = message.toLowerCase();

  if (q.includes("what is skillconnect"))
    return "SkillConnect is a peer-to-peer skill exchange platform for learning without cost.";

  if (q.includes("advantages"))
    return "SkillConnect offers free learning, live interaction, peer teaching, and flexible scheduling.";

  if (q.includes("students"))
    return "SkillConnect helps students clear doubts, prepare for exams, and improve communication.";

  if (q.includes("group"))
    return "Group sessions allow multiple learners to learn the same topic together.";

  return "I can help with questions related to SkillConnect.";
}

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // ✅ PREVIOUS VERSION
    });

    const prompt = `
You are SkillConnect Assistant.
Answer only SkillConnect-related questions.

Knowledge:
${skillconnectContext}

User Question:
${message}
`;

    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });

  } catch (err) {
    console.warn("Gemini unavailable → fallback used");
    res.json({ reply: fallbackAnswer(message) });
  }
});

export default router;