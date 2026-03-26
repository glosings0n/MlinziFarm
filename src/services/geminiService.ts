import { GoogleGenAI, Type } from "@google/genai";
import { FarmAnalysisResponse } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function analyzeFarmRisk(
  location: string,
  weatherJson: string,
  satelliteDescription: string
): Promise<FarmAnalysisResponse | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze the following data for a farm in ${location}, Kenya (Date: March 26, 2026).
        
        Weather Data: ${weatherJson}
        Satellite Observation: ${satelliteDescription}
        
        Context: Kenya is currently facing severe "long rains" flooding. 
        High-risk zones include Tana River, Kisumu, Nairobi, and Uasin Gishu.
        
        Provide a JSON response following the required schema.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk_status: {
              type: Type.STRING,
              description: "CRITICAL, ALERT, or STABLE",
              enum: ["CRITICAL", "ALERT", "STABLE"]
            },
            impact_analysis: {
              type: Type.STRING,
              description: "2-sentence breakdown of water levels on soil and crops."
            },
            extension_advice: {
              type: Type.OBJECT,
              properties: {
                Crop_Actions: { type: Type.STRING },
                Livestock_Safety: { type: Type.STRING }
              },
              required: ["Crop_Actions", "Livestock_Safety"]
            },
            multilingual_alert: {
              type: Type.OBJECT,
              properties: {
                English: { type: Type.STRING },
                "Sheng/Swahili": { type: Type.STRING }
              },
              required: ["English", "Sheng/Swahili"]
            },
            planting_schedule: {
              type: Type.STRING,
              description: "Climate-smart recommendation for the next 7 days."
            }
          },
          required: ["risk_status", "impact_analysis", "extension_advice", "multilingual_alert", "planting_schedule"]
        },
        tools: [{ googleSearch: {} }],
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FarmAnalysisResponse;
    }
    return null;
  } catch (error) {
    console.error("Error analyzing farm risk:", error);
    throw error;
  }
}

export async function getLatestFloodNews() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "What is the current flood situation in Kenya as of March 26, 2026? Focus on Tana River, Kisumu, and Nairobi.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching flood news:", error);
    throw error;
  }
}
