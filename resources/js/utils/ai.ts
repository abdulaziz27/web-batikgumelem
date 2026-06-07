import axios from 'axios';

export interface AIChatProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    url: string;
}

export interface AIChatResponse {
    answer: string;
    products?: AIChatProduct[];
}

export async function askAI(question: string): Promise<AIChatResponse> {
    try {
        const response = await axios.post('/api/ai-chat', { question });
        return {
            answer: response.data.answer,
            products: response.data.products || [],
        };
    } catch (error) {
        return { answer: 'Maaf, terjadi gangguan teknis. Silakan coba lagi atau hubungi admin.', products: [] };
    }
}
