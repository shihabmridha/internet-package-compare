import {AiAssistant} from "@/ai-assistant/ai-assistant.ts";
import {Constants} from "@/lib/constants.ts";
import {Package} from "@/package/package.ts";
import {Operators} from "@/enums/operator.ts";
import {GenerativeAI} from "@/genAI/gen-ai.ts";

export class AssistantService {
    private readonly apiKey: string | null;
    private genAI: AiAssistant | null;

    constructor() {
        this.apiKey = localStorage.getItem(Constants.GeminiLocalStorageKey) || null;
        this.genAI = null;

        if (this.apiKey) {
            this.genAI = new GenerativeAI();
            this.genAI.init(this.apiKey);
        }
    }

    private formatDataForPrompt(packages: Package[]): string {
        let formattedText = "Mobile Internet Packages Information:\n\n";

        // Group packages by operator
        const packagesByOperator = packages.reduce((acc, pkg) => {
            if (!acc[pkg.operator]) {
                acc[pkg.operator] = [];
            }
            acc[pkg.operator].push(pkg);
            return acc;
        }, {} as Record<Operators, Package[]>);

        // Format each operator's packages
        for (const [operator, operatorPackages] of Object.entries(packagesByOperator)) {
            formattedText += `Operator: ${operator}\n`;
            operatorPackages.forEach(pkg => {
                formattedText += `- Package: ${pkg.title}\n`;
                formattedText += `  Description: ${pkg.description}\n`;
                formattedText += `  Price: ${pkg.price} Taka\n`;
                formattedText += `  Validity: ${pkg.validity} days\n`;
                formattedText += `  Data Volume: ${pkg.volume} MB\n`;
                formattedText += `  Bonus Data: ${pkg.bonusVolume} MB\n`;
                formattedText += `  Talk Time: ${pkg.talkTime} minutes\n`;
                formattedText += `  Bonus Talk Time: ${pkg.bonusTalkTime} minutes\n`;
                formattedText += `  SMS: ${pkg.sms}\n`;
                formattedText += `  Bonus SMS: ${pkg.bonusSms}\n\n`;
            });
        }

        return formattedText;
    }

     private getPrompt(packages: Package[], userQuery: string) {
        const formattedData = this.formatDataForPrompt(packages);
        return `
        Based on the following mobile internet package information:
        ${formattedData}

        Please answer this question: ${userQuery}
       
        Consider factors like:
        - There are packages with unlimited data
        - There are packages with unlimited validity (but actually 10 years)
        - Important: some packages are specific social media and other websites can not be used
        - Total data volume (including bonus)
        - Validity period
        - Internet volume gets priority over additional benefits
        - Overall value for money
        - Additional benefits like talk time and SMS
        
        Your response must be short and follow the format:
        - Recommendation:
        - Explanation:
        
        Provide clear recommendation and shortly explanation of your recommendation. Also explain why not other option.
        You must give the response in HTML format without head and body tag and
        `;
    }

    getApiKey(): string | null {
        return this.apiKey;
    }
    setApiKey(apiKey: string): void {
        if (apiKey === '') {
            throw new Error('API key cannot be empty');
        }

        localStorage.setItem(Constants.GeminiLocalStorageKey, apiKey);
        this.genAI = new GenerativeAI();
        this.genAI.init(apiKey);
    }

    clearApiKey(): void {
        localStorage.removeItem(Constants.GeminiLocalStorageKey);
        this.genAI = null;
    }

    async getSuggestion(userQuery: string, packages: Package[]) {
        if (!this.apiKey || this.apiKey === '') {
            return 'API key not found';
        }

        const prompt = this.getPrompt(packages, userQuery);
        return this.genAI?.query(prompt);
    }
}
