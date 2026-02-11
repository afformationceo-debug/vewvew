import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentStore = create(
  persist(
    (set, get) => ({
      items: [],
      addRecent: (pkg) => {
        const items = get().items.filter(item => item.id !== pkg.id);
        const newItem = {
          id: pkg.id,
          title: pkg.title,
          image: pkg.images[0],
          price: pkg.pricing.salePrice || pkg.pricing.originalPrice,
          originalPrice: pkg.pricing.originalPrice,
          rating: pkg.rating,
          reviewCount: pkg.reviewCount,
          location: pkg.location,
          viewedAt: new Date().toISOString()
        };
        set({ items: [newItem, ...items].slice(0, 50) });
      },
      clearRecent: () => set({ items: [] }),
      getGrouped: () => {
        const items = get().items;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 86400000);
        const weekAgo = new Date(today.getTime() - 7 * 86400000);
        return {
          today: items.filter(i => new Date(i.viewedAt) >= today),
          yesterday: items.filter(i => { const d = new Date(i.viewedAt); return d >= yesterday && d < today; }),
          thisWeek: items.filter(i => { const d = new Date(i.viewedAt); return d >= weekAgo && d < yesterday; }),
          older: items.filter(i => new Date(i.viewedAt) < weekAgo),
        };
      }
    }),
    { name: 'kmedi-recent' }
  )
);
