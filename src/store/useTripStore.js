import { create } from 'zustand';

export const TRIP_TYPES = [
  {
    id: 'medical-only',
    emoji: '🏥',
    steps: ['treatment'],
  },
  {
    id: 'medical-stay',
    emoji: '🏥🏨',
    steps: ['treatment', 'accommodation'],
  },
  {
    id: 'full-experience',
    emoji: '🏥🏨🍽️🗺️',
    steps: ['treatment', 'accommodation', 'dining', 'attractions'],
  },
];

export const useTripStore = create((set, get) => ({
  // Trip type
  tripType: null,

  // Current step index
  currentStep: 0,

  // Selections
  selectedCategory: null,
  selectedHospital: null,
  selectedTreatment: null,
  selectedAccommodation: null,
  selectedRestaurants: [],
  selectedAttractions: [],

  // Contact info
  contactInfo: {
    name: '',
    email: '',
    phone: '',
    country: '',
    preferredDate: '',
    message: '',
  },

  // Submission state
  isSubmitted: false,

  // Actions
  setTripType: (type) => set({ tripType: type, currentStep: 0 }),

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, tripType } = get();
    const type = TRIP_TYPES.find(t => t.id === tripType);
    if (type && currentStep < type.steps.length) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSelectedHospital: (h) => set({ selectedHospital: h }),
  setSelectedTreatment: (t) => set({ selectedTreatment: t }),
  setSelectedAccommodation: (a) => set({ selectedAccommodation: a }),

  toggleRestaurant: (id) => set(state => ({
    selectedRestaurants: state.selectedRestaurants.includes(id)
      ? state.selectedRestaurants.filter(r => r !== id)
      : [...state.selectedRestaurants, id],
  })),

  toggleAttraction: (id) => set(state => ({
    selectedAttractions: state.selectedAttractions.includes(id)
      ? state.selectedAttractions.filter(a => a !== id)
      : [...state.selectedAttractions, id],
  })),

  setContactInfo: (info) => set(state => ({
    contactInfo: { ...state.contactInfo, ...info },
  })),

  submit: () => set({ isSubmitted: true }),

  reset: () => set({
    tripType: null,
    currentStep: 0,
    selectedCategory: null,
    selectedHospital: null,
    selectedTreatment: null,
    selectedAccommodation: null,
    selectedRestaurants: [],
    selectedAttractions: [],
    contactInfo: { name: '', email: '', phone: '', country: '', preferredDate: '', message: '' },
    isSubmitted: false,
  }),

  // Computed
  getSteps: () => {
    const { tripType } = get();
    const type = TRIP_TYPES.find(t => t.id === tripType);
    return type ? [...type.steps, 'contact'] : [];
  },

  getTotalSteps: () => {
    const { tripType } = get();
    const type = TRIP_TYPES.find(t => t.id === tripType);
    return type ? type.steps.length + 1 : 0;
  },
}));
