import { useState } from 'react';
import { Send, Clock, ExternalLink } from 'lucide-react';
import Modal from '../common/Modal';
import { messengers } from '../../data/messengers';
import { useUIStore } from '../../store/useUIStore';

export default function ConsultModal() {
  const { isConsultModalOpen, closeConsultModal, consultModalPackage, addToast } = useUIStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast({ type: 'success', message: 'Inquiry sent! We\'ll get back to you soon.' });
    setFormData({ name: '', email: '', message: '' });
    setShowForm(false);
    closeConsultModal();
  };

  const prefilledMsg = consultModalPackage
    ? `Hi, I'd like to consult about: ${consultModalPackage}`
    : 'Hi, I\'d like to consult about a medical tour package.';

  return (
    <Modal isOpen={isConsultModalOpen} onClose={closeConsultModal} title="Consult with Us" size="sm">
      <div className="p-6">
        {consultModalPackage && (
          <div className="bg-primary-50 rounded-xl px-4 py-3 mb-5">
            <p className="text-xs text-primary-500 font-medium">Consulting about</p>
            <p className="text-sm font-semibold text-primary-900 mt-0.5">{consultModalPackage}</p>
          </div>
        )}

        <p className="text-sm text-gray-500 mb-4">Choose your preferred messenger for a free consultation:</p>

        <div className="space-y-2.5">
          {messengers.map((m) => {
            const messengerUrl = m.url && m.url !== '#'
              ? `${m.url}${m.url.includes('wa.me') ? `?text=${encodeURIComponent(prefilledMsg)}` : ''}`
              : null;

            return (
              <a
                key={m.id}
                href={messengerUrl || '#'}
                target={messengerUrl ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={messengerUrl ? undefined : (e) => { e.preventDefault(); addToast({ type: 'info', message: `${m.label} coming soon!` }); }}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: m.color + '20' }}
                >
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900">{m.label}</span>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {m.responseTime}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </a>
            );
          })}
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
        </div>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
          >
            Send a Quick Inquiry
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData(s => ({ ...s, name: e.target.value }))}
              required
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData(s => ({ ...s, email: e.target.value }))}
              required
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              placeholder="Your question..."
              value={formData.message}
              onChange={(e) => setFormData(s => ({ ...s, message: e.target.value }))}
              rows={3}
              required
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              Send Inquiry
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
}
