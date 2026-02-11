import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAIStore } from '../../store/useAIStore';
import { cn } from '../../utils/cn';

const CATEGORIES = [
  { key: 'beauty', label: 'Beauty', emoji: '✨' },
  { key: 'plastic', label: 'Plastic Surgery', emoji: '🏥' },
  { key: 'dental', label: 'Dental', emoji: '🦷' },
  { key: 'checkup', label: 'Health Checkup', emoji: '🩺' },
  { key: 'diet', label: 'Diet', emoji: '💪' },
  { key: 'other', label: 'Other', emoji: '🔍' },
];

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-gray-500" />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-md px-3 py-2">
        <div className="typing-dots flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ rec }) {
  return (
    <Link
      to={`/package/${rec.slug}`}
      className="block bg-white rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all p-2.5 group"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-gray-800 truncate group-hover:text-primary-600 transition-colors">
            {rec.title}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-primary-600">{rec.price}</span>
            <span className="text-[10px] text-gray-400">|</span>
            <span className="text-[10px] text-amber-500 font-medium">★ {rec.rating}</span>
          </div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

function MessageBubble({ message }) {
  const isAI = message.role === 'ai';

  return (
    <div className={cn('flex mb-3', isAI ? 'items-start gap-2' : 'justify-end')}>
      {isAI && (
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-gray-500" />
        </div>
      )}
      <div className={cn('max-w-[80%]')}>
        <div
          className={cn(
            'px-3 py-2 text-[13px] leading-relaxed',
            isAI
              ? 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-md'
              : 'bg-primary-500 text-white rounded-2xl rounded-tr-md'
          )}
        >
          {message.content}
        </div>
        {message.recommendations && message.recommendations.length > 0 && (
          <div className="mt-1.5 flex flex-col gap-1.5">
            {message.recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3 px-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function AIBeautyChat() {
  const {
    messages,
    isTyping,
    isOpen,
    selectedCategory,
    toggleAI,
    sendMessage,
    selectCategory,
  } = useAIStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button — white, lightweight */}
      <button
        onClick={toggleAI}
        className={cn(
          'fixed z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all',
          'bottom-20 right-4 md:bottom-6 md:right-6',
          'bg-white shadow-lg border border-gray-200 hover:shadow-xl',
        )}
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Sparkles className="w-5 h-5 text-violet-500" />
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <div
            className={cn(
              'fixed z-50 w-72 max-h-[65vh] flex flex-col',
              'bottom-36 right-4 md:bottom-20 md:right-6',
              'bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200',
              'animate-in fade-in slide-in-from-bottom-3 duration-200'
            )}
          >
            {/* Header — white, clean */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">K-MEDI AI</h3>
                  <p className="text-[10px] text-gray-400">Your beauty concierge</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-[10px] text-gray-400">Online</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-hide">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {!selectedCategory && messages.length === 1 && (
                <CategoryChips onSelect={selectCategory} />
              )}

              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 border-t border-gray-100 px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-400 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                    input.trim()
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-center text-[9px] text-gray-400 mt-1.5">
                Powered by K-MEDI AI
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
