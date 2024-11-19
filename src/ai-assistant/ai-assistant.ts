export interface AiAssistant {
    init(apiKey: string): boolean;
    query(prompt: string): Promise<string>;
}