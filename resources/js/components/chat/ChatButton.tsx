import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { askAI, type AIChatProduct } from '@/utils/ai';
import { MessageSquare, Send, User, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    products?: AIChatProduct[];
}

const ChatButton = () => {
    const { addToCart } = useCart();
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
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const urlRegex = useMemo(() => /(https?:\/\/[^\s]+|\/products\/[^\s)]+)/g, []);

    const renderTextWithLinks = (text: string) => {
        const lines = (text || '').split('\n');
        return lines.map((line, lineIdx) => {
            const parts = line.split(urlRegex);
            return (
                <span key={`line-${lineIdx}`}>
                    {parts.map((part, idx) => {
                        if (part.match(urlRegex)) {
                            const href = part;
                            return (
                                <a
                                    key={`${href}-${lineIdx}-${idx}`}
                                    href={href}
                                    className="text-batik-indigo break-words underline underline-offset-2 hover:opacity-90"
                                    target={href.startsWith('http') ? '_blank' : undefined}
                                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                                >
                                    {part}
                                </a>
                            );
                        }
                        return <span key={`${lineIdx}-${idx}`}>{part}</span>;
                    })}
                    {lineIdx < lines.length - 1 ? <br /> : null}
                </span>
            );
        });
    };

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
            const { answer, products } = await askAI(message);
            const botResponse: ChatMessage = {
                id: messages.length + 2,
                text: answer,
                sender: 'bot',
                timestamp: new Date(),
                products,
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

    useEffect(() => {
        if (!isOpen) return;
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, isOpen]);

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
                <div className="absolute right-0 bottom-20 w-[22rem] overflow-hidden rounded-lg border bg-white shadow-2xl sm:w-[28rem] md:w-[32rem]">
                    <div className="bg-batik-indigo flex items-center justify-between p-4">
                        <h2 className="font-medium text-white">Chat dengan Kami</h2>
                        <Button variant="ghost" size="icon" onClick={toggleChat} className="hover:bg-batik-indigo/80 text-white">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex h-[28rem] max-h-[70vh] flex-col">
                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`rounded-lg p-3 ${
                                            msg.sender === 'user'
                                                ? 'max-w-[80%] bg-batik-indigo rounded-tr-none text-white'
                                                : `max-w-[92%] rounded-tl-none bg-gray-100 text-gray-800 ${msg.products?.length ? 'w-full' : ''}`
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
                                        <p className="text-sm">{renderTextWithLinks(msg.text)}</p>
                                        {msg.sender === 'bot' && msg.products && msg.products.length > 0 && (
                                            <div className="mt-3">
                                                <div className="flex gap-3 overflow-x-auto pb-2">
                                                    {msg.products.map((p) => (
                                                        <a
                                                            key={p.id}
                                                            href={p.url}
                                                            className="min-w-[180px] max-w-[180px] rounded-md border bg-white shadow-sm transition hover:shadow-md"
                                                        >
                                                            <div className="aspect-[4/3] w-full overflow-hidden rounded-t-md bg-gray-50">
                                                                {p.image ? (
                                                                    <img
                                                                        src={`/storage/${p.image}`}
                                                                        alt={p.name}
                                                                        className="h-full w-full object-cover"
                                                                        loading="lazy"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                                        No image
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-2">
                                                                <div className="line-clamp-2 text-sm font-semibold text-gray-900">{p.name}</div>
                                                                <div className="mt-1 text-xs text-gray-600">
                                                                    Rp {Number(p.price || 0).toLocaleString('id-ID')}
                                                                </div>
                                                                <div className="mt-2">
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        className="bg-batik-indigo hover:bg-batik-indigo/90 h-8 w-full"
                                                                        onClick={(ev) => {
                                                                            ev.preventDefault();
                                                                            addToCart({
                                                                                id: p.id,
                                                                                name: p.name,
                                                                                price: p.price,
                                                                                image: p.image || '',
                                                                                slug: p.slug,
                                                                                quantity: 1,
                                                                            });
                                                                        }}
                                                                    >
                                                                        Add to cart
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <span className="mt-1 block text-right text-xs opacity-70">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="max-w-[92%] rounded-lg rounded-tl-none bg-gray-100 p-3 text-gray-800">
                                        <div className="mb-1 flex items-center">
                                            <div className="bg-batik-brown mr-1 flex h-5 w-5 items-center justify-center rounded-full">
                                                <User className="h-3 w-3 text-white" />
                                            </div>
                                            <span className="text-xs font-semibold">Admin</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Sedang mengetik</span>
                                            <span className="inline-flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.2s]" />
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.1s]" />
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-500" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
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
