
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private static getClient() {
    // Always use the required initialization format using process.env.API_KEY directly
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async testConnection(): Promise<boolean> {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Ping',
      });
      // Access text property directly as per guidelines
      return !!response.text;
    } catch (error) {
      console.error("Connection test failed:", error);
      throw error;
    }
  }

  static async getHint(target: number, lastGuess: number, result: 'higher' | 'lower', history: number[]): Promise<string> {
    try {
      const ai = this.getClient();
      const prompt = `
        You are a mystical and slightly snarky game oracle. 
        The secret number is ${target}. 
        The user just guessed ${lastGuess}, and it was ${result === 'higher' ? 'too high' : 'too low'}.
        Previous guesses: ${history.join(', ')}.
        Provide a short, cryptic, but helpful hint or witty comment to encourage the user. 
        Do not reveal the actual number. Keep it under 20 words.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Use .text property to extract output
      return response.text || "The stars are silent, try again.";
    } catch (error) {
      return "The connection to the oracle is flickering. Trust your intuition.";
    }
  }
}