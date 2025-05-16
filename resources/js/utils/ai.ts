import axios from 'axios';

export async function askAI(question: string): Promise<string> {
    try {
        const response = await axios.post('/api/ai-chat', { question });
        return response.data.answer;
    } catch (error) {
        return 'Maaf, terjadi gangguan teknis. Silakan coba lagi atau hubungi admin.';
    }
}
