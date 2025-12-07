import { GoogleGenAI, Type } from "@google/genai";
import { CoinAnalysisResult } from "../types";

// Ensure API key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeCoinImage = async (base64Image: string): Promise<CoinAnalysisResult> => {
  try {
    // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this image. If it is a coin, identify its title (denomination and name), country of origin, year of minting, estimated metallic composition (e.g., Copper, Silver, Zinc), and write a short, interesting historical or descriptive fact about it (max 2 sentences). Also provide a rough estimate of collector value range (e.g., '$1 - $5'). If it is not a coin, return a description stating that it doesn't look like a coin.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The denomination and name of the coin" },
            country: { type: Type.STRING, description: "Country of origin" },
            year: { type: Type.STRING, description: "Year of minting, or 'Unknown' if illegible" },
            description: { type: Type.STRING, description: "A short interesting fact or description" },
            composition: { type: Type.STRING, description: "Metallic composition" },
            estimatedValue: { type: Type.STRING, description: "Rough collector value range" }
          },
          required: ["title", "country", "year", "description"],
        },
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as CoinAnalysisResult;
    }
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("Failed to analyze coin image. Please try again or enter details manually.");
  }
};
