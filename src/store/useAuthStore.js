import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => set(state => ({ user: { ...state.user, ...data } })),
      loginWithProvider: (provider) => set({
        user: {
          id: 'user-social-001',
          name: provider === 'google' ? 'Google User' : provider === 'line' ? 'LINE User' : provider === 'kakao' ? 'Kakao User' : 'Apple User',
          email: `demo@${provider}.example.com`,
          avatar: `https://picsum.photos/seed/${provider}/200/200`,
          country: 'US',
          countryCode: 'US',
          memberSince: new Date().toISOString().split('T')[0],
          tier: 'Bronze',
          points: 0,
          bookings: 0,
          reviews: 0,
          provider,
        },
        isAuthenticated: true,
      }),
      // Demo user for development
      loginDemo: () => set({
        user: {
          id: 'user-001',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          avatar: 'https://picsum.photos/seed/user1/200/200',
          country: 'US',
          countryCode: 'US',
          memberSince: '2025-06-15',
          tier: 'Gold',
          points: 12500,
          bookings: 3,
          reviews: 2
        },
        isAuthenticated: true
      }),
    }),
    { name: 'kmedi-auth' }
  )
);
