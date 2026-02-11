import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../store/useUIStore';
import { messengers } from '../../data/messengers';
import { cn } from '../../utils/cn';

export default function FloatingChat() {
  const { t } = useTranslation();
  const { isChatOpen, toggleChat, addToast } = useUIStore();
  const [showInquiry, setShowInquiry] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast({ type: 'success', message: t('chat.inquiry_success') });
    setFormData({ name: '', email: '', message: '' });
    setShowInquiry(false);
    toggleChat();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        animate={isChatOpen ? {} : { scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
        className={cn(
          'fixed z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-colors',
          'bottom-20 right-4 md:bottom-6 md:right-6',
          isChatOpen ? 'bg-gray-700' : 'bg-gradient-to-r from-primary-600 to-primary-700'
        )}
      >
        {isChatOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Chat Menu */}
      <AnimatePresence>
        {isChatOpen && !showInquiry && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed z-50 bottom-36 right-4 md:bottom-22 md:right-6 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3">
              <h3 className="text-white font-semibold text-sm">{t('chat.title')}</h3>
              <p className="text-white/70 text-xs">{t('chat.subtitle')}</p>
            </div>
            <div className="p-2">
              {messengers.map(m => (
                <motion.button
                  key={m.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    if (m.url && m.url !== '#') {
                      window.open(m.url, '_blank');
                    } else {
                      setShowInquiry(true);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-sm', m.bgClass)}>
                    {m.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{m.label}</span>
                </motion.button>
              ))}
              {/* Quick Inquiry option */}
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setShowInquiry(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-primary-600">
                  📧
                </div>
                <span className="text-sm font-medium text-gray-700">Quick Inquiry</span>
              </motion.button>
            </div>
            <div className="px-4 pb-3">
              <a href="tel:+82212345678" className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                <Phone className="w-3 h-3" />
                24/7 Emergency: +82-2-1234-5678
              </a>
            </div>
          </motion.div>
        )}

        {/* Quick Inquiry Form */}
        {isChatOpen && showInquiry && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed z-50 bottom-36 right-4 md:bottom-22 md:right-6 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">{t('chat.inquiry')}</h3>
              <button onClick={() => setShowInquiry(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input
                type="text"
                placeholder={t('chat.inquiry_name')}
                value={formData.name}
                onChange={(e) => setFormData(s => ({ ...s, name: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="email"
                placeholder={t('chat.inquiry_email')}
                value={formData.email}
                onChange={(e) => setFormData(s => ({ ...s, email: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <textarea
                placeholder={t('chat.inquiry_placeholder')}
                value={formData.message}
                onChange={(e) => setFormData(s => ({ ...s, message: e.target.value }))}
                rows={3}
                required
                className="w-full px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
                {t('chat.inquiry_submit')}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
