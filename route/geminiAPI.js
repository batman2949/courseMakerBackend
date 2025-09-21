const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

router.post("/", async (req, res) => {
  console.log("➡️ Received new request to /");

  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "No input data provided" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const prompt = `
You are an expert course creator.

Use the following input values EXACTLY (do not modify them):
- Title: ${data.title}
- Topic: ${data.topic}
- Category: ${data.category}
- Level: ${data.level}
- Number of Chapters: ${data.chapters}

Generate a VALID JSON object following this exact schema:

{
  "title": "${data.title}",
  "topic": "${data.topic}",
  "category": "${data.category}",
  "level": "${data.level}",
  "totalChapters": ${data.chapters},
  "chapters": [
    {
      "id": "chapter-1",
      "name": "string",
      "description": "string",
      "level": "beginner | intermediate | advanced"
    }
  ]
}

Rules:
- DO NOT add explanations, comments, markdown, or extra text.
- Make sure the JSON is syntactically correct.
- Do not use trailing commas.
- Always put keys and string values in double quotes.
- Return only the JSON, nothing else.
`;



    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    console.log("✅ Gemini response received.");

    return res.status(200).json({ course: response.text });

  } catch (err) {
    console.error("❌ Error:", err.message || err);
    return res.status(500).json({ error: "Failed to generate course" });
  }
});

router.post("/geminiChapters", async (req, res) => {
  const { data, title, topic } = req.body;
  if (!data || !title || !topic) {
    return res.status(400).json({ error: "No input data provided" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    const prompt = `
You are an expert educator. Write DETAILED course content for this single chapter.
You are given ONE chapter at a time with its title and description.
Generate ONLY ONE chapter's content.
Do NOT create multiple chapters.
Stick strictly to the given chapter name and description.

Use the following input values EXACTLY:
- Course Title: ${title}
- Topic: ${topic}
- Chapter Name: ${data.name}
- Chapter Description: ${data.description}
- Level: ${data.level}

Generate a VALID JSON object with this exact schema:

{
  "chapterName": "${data.name}",
  "summary": "string (2-3 lines summarizing the entire chapter in simple language)",
  "content": [
    {
      "heading": "string (clear section title)",
      "text": ["string (detailed explanation as array of bullet points or numbered points, 3-5 sentences per point, highlight key concepts in **bold**)"],
      "code": "optional string of code",
      "codeExplanation": ["optional array of lines explaining the code, highlight important terms in **bold**"]
    }
  ],
  "youtubeSearch": {
    "channel": "string (best channel to learn this topic, e.g., freeCodeCamp)",
    "query": "string (specific search query for this chapter's topic)"
  },
  "images": [
    {
      "alt": "short alt text for image",
      "searchQuery": "string (Google image search query relevant to this chapter)"
    }
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "string (must match one of the options)"
    }
  ]
}

Rules:
- Write a **minimum of 250 words** in total for the combined content array.
- Use multiple content blocks with proper "heading" and "text" for clear structure.
- In the "text" fields, **write content strictly as an array of numbered or bulleted points**.
- Always **bold key concepts, important terms, and anything that should be emphasized**.
- If you include "code", always include "codeExplanation" as an **array of lines**, highlighting key parts in **bold**.
- Add exactly 1-2 highly relevant image search queries in "images".
- Add 3-5 quiz questions covering key points of this chapter.
- Make sure the JSON is syntactically correct: no trailing commas, all keys/strings must be in double quotes.
- DO NOT add extra explanations, markdown, or comments outside the JSON.
- The output must be **strictly a single JSON object**, ready for parsing.
`;



    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });


    console.log("✅ Chapter content response received");

    return res.status(200).json({ chapter: response.text });


  } catch (err) {
    console.error("❌ Error:", err.message || err);
    return res.status(500).json({ error: "Failed to generate course" });
  }
})

module.exports = router;
