import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { askAI } from '@/utils/ai';
import { MessageSquare, Send, User, X } from 'lucide-react';
import { useState } from 'react';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const ChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            text: 'Halo! Selamat datang di Batik Gumelem. Ada yang bisa saya bantu?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [loading, setLoading] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        const newUserMessage: ChatMessage = {
            id: messages.length + 1,
            text: message,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setMessage('');
        setLoading(true);
        try {
            const answer = await askAI(message);
            const botResponse: ChatMessage = {
                id: messages.length + 2,
                text: answer,
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
            // toast.success("Pesan baru diterima", {
            //   description: "Asisten AI telah merespon",
            // });
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: messages.length + 2,
                    text: 'Maaf, terjadi gangguan teknis. Silakan coba lagi atau hubungi admin.',
                    sender: 'bot',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed right-6 bottom-6 z-50">
            {/* Chat toggle button */}
            <Button
                onClick={toggleChat}
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
                    isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-batik-indigo hover:bg-batik-indigo/90'
                }`}
                size="icon"
                aria-label="Chat dengan kami"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </Button>

            {/* Chat box */}
            {isOpen && (
                <div className="absolute right-0 bottom-20 w-80 overflow-hidden rounded-lg border bg-white shadow-2xl sm:w-96">
                    <div className="bg-batik-indigo flex items-center justify-between p-4">
                        <h2 className="font-medium text-white">Chat dengan Kami</h2>
                        <Button variant="ghost" size="icon" onClick={toggleChat} className="hover:bg-batik-indigo/80 text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex h-96 flex-col">
                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${
                                            msg.sender === 'user'
                                                ? 'bg-batik-indigo rounded-tr-none text-white'
                                                : 'rounded-tl-none bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {msg.sender === 'bot' && (
                                            <div className="mb-1 flex items-center">
                                                <div className="bg-batik-brown mr-1 flex h-5 w-5 items-center justify-center rounded-full">
                                                    <User className="h-3 w-3 text-white" />
                                                </div>
                                                <span className="text-xs font-semibold">Admin</span>
                                            </div>
                                        )}
                                        <p className="text-sm">{msg.text}</p>
                                        <span className="mt-1 block text-right text-xs opacity-70">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t p-3">
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tulis pesan..."
                                className="flex-1"
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="bg-batik-indigo hover:bg-batik-indigo/90"
                                disabled={!message.trim() || loading}
                            >
                                {loading ? <span className="animate-spin">...</span> : <Send className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatButton;
