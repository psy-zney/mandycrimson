import { GoogleGenAI } from "@google/genai";

export const formatOrderWithAI = async (rawText: string) => {
  // Đảm bảo sử dụng process.env.API_KEY theo hướng dẫn
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform the following order text into a clean list of products. 
      Return ONLY a JSON array of strings, where each string is a product item.
      Example: ["basic off-shoulder top (grey)", "kitty miniskirt"]
      
      Input text: ${rawText}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};