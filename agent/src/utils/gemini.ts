import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGeminiResponse = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini error:", error);
    return "Error generating content";
  }
};
