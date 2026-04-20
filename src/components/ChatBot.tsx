import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SYSTEM_PROMPT = `You are the OMNI Product Expert — a sophisticated AI assistant for the OMNI macro pad device.
Answer questions ONLY about OMNI. Politely redirect anything else back to OMNI.

OMNI Product Details:
- Description: A high-end, customizable macro pad and AI interface.
- Features: 3x3 hot-swap mechanical switches, 0.96" OLED display, dual CNC aluminum rotary encoders, MEMS microphone, OMNI OS v1.0.
- Base Price: 189 TN
- Add-ons: Pro-AI Package (+149 TN), OMNI Care+ (+79 TN)
- Chassis: Silver Aluminum, Stealth Matte, Midnight Blue, Dark Purple
- Keycaps: Arctic White, Obsidian Black, Electric Blue, Dark Purple
Tone: Professional, tech-forward, concise.`;

async function getElephantResponse(messages: { role: string; content: string }[]): Promise<string> {
  const body = JSON.stringify({
    model: "openrouter/elephant-alpha",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ],
    max_tokens: 512,
    temperature: 0.7,
  });

  try {
    // Use /api/chat proxy — works on Vercel (server-side, no CORS)
    // Falls back to direct call locally
    const endpoint = "/api/chat";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      if (text) return text;
    }

    const err = await res.json().catch(() => ({}));
    console.error("Chat proxy error:", res.status, err);
  } catch (err) {
    console.error("ChatBot error:", err);
  }

  return "I\'m having trouble connecting right now. Please try again.";
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm your OMNI expert. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    const history = messages.map(m => ({ role: m.role, content: m.text }));
    history.push({ role: 'user', content: userText });
    const reply = await getElephantResponse(history);
    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    setIsLoading(false);
  };

  return (
    /* On mobile: bottom-4 right-4, on desktop: bottom-6 right-6 */
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            /* Full width on small phones, fixed width on larger screens */
            className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] max-w-[360px] h-[75vh] max-h-[520px] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-primary/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_hsl(217_100%_55%/0.4)]">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-foreground">OMNI Expert</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Online</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${m.role === 'user' ? 'bg-white/10' : 'bg-primary/20'}`}>
                      {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-primary" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs font-body leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'glass border border-white/5 rounded-tl-none text-foreground/90'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center glass border border-white/5 p-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    <span className="text-[10px] text-muted-foreground">OMNI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 border-t border-white/10 bg-black/20 flex-shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about OMNI..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-xs font-body focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-[0_0_10px_hsl(217_100%_55%/0.3)]"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-white/10 border border-white/10' : 'bg-primary glow-blue'}`}
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-6 h-6" /></motion.div>
            : <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><MessageSquare className="w-6 h-6 text-primary-foreground" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default ChatBot;
