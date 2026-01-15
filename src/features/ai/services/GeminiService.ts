import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as FileSystem from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';

// Initialize the SDK
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || "");

export const GeminiService = {
  async analyzeImage(imageUri: string) {
    try {
      // FIX 1: Use string 'base64' directly to avoid "EncodingType undefined" crash
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: 'base64',
      });

      // FIX 2: Use stable model name
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const prompt = "Analyze this image. If it contains text, transcribe it perfectly. If it contains a diagram or object, describe it in detail so it can be searchable later. Output ONLY the description/transcription.";

      const imagePart = {
        inlineData: {
          data: base64,
          mimeType: "image/jpeg", 
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
      
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to process image with AI");
    }
  },

  async generateEmbedding(text: string) {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }
};