import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import {AiAssistant} from "@/ai-assistant/ai-assistant.ts";
export class GenerativeAI implements AiAssistant {
    private genAI: GoogleGenerativeAI | null = null;
    private model: GenerativeModel | null = null;

    init(apiKey: string): boolean {
        if (!apiKey) {
            console.error('Gemini API key not found in localStorage');
            return false;
        }

        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            return true;
        } catch (error) {
            console.error('Error initializing Gemini AI:', error);
            return false;
        }
    }

    async query(prompt: string): Promise<string> {
        if (!this.model) {
            console.error('Gemini AI model not initialized');
            return "Sorry, there was an error processing your query.";
        }

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error('Error querying Gemini AI:', error);
            return "Sorry, there was an error processing your query.";
        }
    }
}
