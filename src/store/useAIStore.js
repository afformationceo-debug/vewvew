import { create } from 'zustand';

const AI_RESPONSES = {
  beauty: [
    { id: 'b1', title: 'Juvederm Filler + Gangnam Tour', price: '₩890,000', rating: 4.9, slug: 'juvederm-filler-gangnam-tour' },
    { id: 'b2', title: 'Premium Botox + Sinsa Shopping', price: '₩690,000', rating: 4.8, slug: 'premium-botox-sinsa' },
  ],
  plastic: [
    { id: 'p1', title: 'Rhinoplasty + Recovery Package', price: '₩3,900,000', rating: 4.9, slug: 'rhinoplasty-recovery' },
    { id: 'p2', title: 'Double Eyelid + Seoul Tour', price: '₩2,200,000', rating: 4.7, slug: 'double-eyelid-seoul' },
  ],
  dental: [
    { id: 'd1', title: 'Dental Implant All-in-One', price: '₩1,890,000', rating: 4.8, slug: 'dental-implant-all-in-one' },
    { id: 'd2', title: 'Teeth Whitening + Jeju Trip', price: '₩590,000', rating: 4.6, slug: 'teeth-whitening-jeju' },
  ],
  checkup: [
    { id: 'c1', title: 'Premium Full-Body Checkup + DMZ', price: '₩2,890,000', rating: 4.9, slug: 'premium-checkup-dmz' },
    { id: 'c2', title: 'Anti-Aging Screening + Spa', price: '₩1,590,000', rating: 4.7, slug: 'anti-aging-spa' },
  ],
  diet: [
    { id: 'dt1', title: 'Body Contouring + Wellness Stay', price: '₩2,490,000', rating: 4.8, slug: 'body-contouring-wellness' },
    { id: 'dt2', title: 'Liposuction Package + Recovery', price: '₩3,200,000', rating: 4.7, slug: 'liposuction-recovery' },
  ],
  other: [
    { id: 'o1', title: 'Stem Cell Therapy + VIP Tour', price: '₩8,900,000', rating: 4.9, slug: 'stem-cell-vip' },
    { id: 'o2', title: 'Wellness Detox + Temple Stay', price: '₩1,290,000', rating: 4.6, slug: 'wellness-detox-temple' },
  ],
};

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  content: "Hi there! 👋 I'm K-MEDI AI! Pick a category below or just tell me what you're looking for 😊",
  timestamp: Date.now(),
};

export const useAIStore = create((set, get) => ({
  // Chat state
  messages: [WELCOME_MESSAGE],
  isTyping: false,
  isOpen: false,
  selectedCategory: null,

  // Recommendations
  recommendations: [],
  isAnalyzing: false,

  // Price calculator
  selectedTreatments: [],
  nights: 3,
  companions: 0,
  estimatedPrice: 0,

  // Actions
  toggleAI: () => set((s) => ({ isOpen: !s.isOpen })),
  openAI: () => set({ isOpen: true }),
  closeAI: () => set({ isOpen: false }),

  sendMessage: (text) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isTyping: true,
    }));

    // Simulate AI response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let reply = "I'd love to help! 😊 Tell me what you're looking for and I'll find the best match!";

      if (lowerText.includes('botox') || lowerText.includes('filler') || lowerText.includes('beauty')) {
        reply = "Great choice! ✨ Korea's beauty treatments are world-famous! Here are our top picks in Gangnam 🎉";
      } else if (lowerText.includes('nose') || lowerText.includes('plastic') || lowerText.includes('surgery')) {
        reply = "Awesome! 🏥 Korean plastic surgery is top-notch — 50,000+ successful procedures! Here are our best packages 👇";
      } else if (lowerText.includes('dental') || lowerText.includes('teeth')) {
        reply = "Smart pick! 🦷 Korean dental care is amazing at great prices! Check these out 👇";
      } else if (lowerText.includes('checkup') || lowerText.includes('health')) {
        reply = "Love that! 🩺 Korean health checkups are super thorough — MRI to genetic testing! Here are our top picks 👇";
      } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('budget')) {
        reply = "Great question! 💰 Treatments in Korea cost 40-60% less. Try our AI Price Calculator for a personalized estimate!";
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: reply,
        timestamp: Date.now(),
      };

      set((s) => ({
        messages: [...s.messages, aiMsg],
        isTyping: false,
      }));
    }, 1200 + Math.random() * 800);
  },

  selectCategory: (category) => {
    const categoryLabels = {
      beauty: 'Beauty & Skin',
      plastic: 'Plastic Surgery',
      dental: 'Dental',
      checkup: 'Health Checkup',
      diet: 'Diet & Body',
      other: 'Other',
    };

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: `I'm interested in ${categoryLabels[category] || category}`,
      timestamp: Date.now(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isTyping: true,
      selectedCategory: category,
    }));

    setTimeout(() => {
      const recs = AI_RESPONSES[category] || AI_RESPONSES.other;
      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: `Here are my top picks for ${categoryLabels[category] || 'you'}! 🎉 These are our highest-rated ones 👇`,
        timestamp: Date.now(),
        recommendations: recs,
      };

      set((s) => ({
        messages: [...s.messages, aiMsg],
        isTyping: false,
        recommendations: recs,
      }));
    }, 1000 + Math.random() * 500);
  },

  getRecommendation: () => {
    set({ isAnalyzing: true });
    setTimeout(() => {
      set({
        isAnalyzing: false,
        recommendations: AI_RESPONSES.beauty,
      });
    }, 1500);
  },

  calculatePrice: () => {
    const { selectedTreatments, nights, companions } = get();
    const treatmentCosts = {
      botox: 350000,
      filler: 550000,
      rhinoplasty: 3500000,
      dental_implant: 1200000,
      checkup: 890000,
      whitening: 250000,
      liposuction: 2800000,
      eyelid: 1800000,
    };

    const treatmentTotal = selectedTreatments.reduce(
      (sum, t) => sum + (treatmentCosts[t] || 500000),
      0
    );
    const hotelPerNight = 180000;
    const totalPeople = 1 + companions;

    const estimated =
      treatmentTotal + nights * hotelPerNight * totalPeople;

    set({ estimatedPrice: estimated });
    return estimated;
  },

  toggleTreatment: (treatment) =>
    set((s) => ({
      selectedTreatments: s.selectedTreatments.includes(treatment)
        ? s.selectedTreatments.filter((t) => t !== treatment)
        : [...s.selectedTreatments, treatment],
    })),

  setNights: (n) => set({ nights: Math.max(1, Math.min(14, n)) }),
  setCompanions: (n) => set({ companions: Math.max(0, Math.min(5, n)) }),

  resetChat: () =>
    set({
      messages: [WELCOME_MESSAGE],
      isTyping: false,
      selectedCategory: null,
      recommendations: [],
    }),
}));
