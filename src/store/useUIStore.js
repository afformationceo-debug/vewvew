import { create } from 'zustand';

export const useUIStore = create((set) => ({
  language: 'en',
  currency: 'KRW',
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isChatOpen: false,
  isConsultModalOpen: false,
  isLoginModalOpen: false,
  consultModalPackage: '',
  toasts: [],
  setLanguage: (lang) => set({ language: lang }),
  setCurrency: (currency) => set({ currency }),
  toggleMobileMenu: () => set(s => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  toggleSearch: () => set(s => ({ isSearchOpen: !s.isSearchOpen })),
  toggleChat: () => set(s => ({ isChatOpen: !s.isChatOpen })),
  openConsultModal: (title) => set({ isConsultModalOpen: true, consultModalPackage: title || '' }),
  closeConsultModal: () => set({ isConsultModalOpen: false, consultModalPackage: '' }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  addToast: (toast) => {
    const id = Date.now().toString();
    set(s => ({ toasts: [...s.toasts, { id, ...toast }] }));
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3000);
  },
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}));
