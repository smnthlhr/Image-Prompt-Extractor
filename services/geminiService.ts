
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const INSTRUCTIONAL_PROMPT = `You are an expert image prompt generator. Analyze this image in extreme detail. 
Create a concise but highly descriptive prompt that could be used to regenerate this image with an AI image generator. 
Describe everything with rich keywords separated by commas: 
- Subject: What is the main subject? Describe their appearance, clothing, action, and expression.
- Environment: Where is the subject? Describe the background, foreground, and any notable objects.
- Lighting: Describe the lighting style (e.g., soft light, golden hour, cinematic lighting, neon glow).
- Colors: What is the overall color palette? Mention dominant and accent colors.
- Composition: Describe the camera angle (e.g., low angle shot, eye-level, wide shot) and lens (e.g., wide-angle, macro, 35mm). Mention composition techniques (e.g., rule of thirds, leading lines).
- Style: What is the artistic style (e.g., photorealistic, impressionistic, futuristic, retro, anime).`;


export const generatePromptFromImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: INSTRUCTIONAL_PROMPT,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating prompt from Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
};
