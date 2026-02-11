import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (pkg) => {
        const items = get().items;
        const exists = items.find(item => item.id === pkg.id);
        if (exists) {
          set({ items: items.filter(item => item.id !== pkg.id) });
        } else {
          set({ items: [...items, {
            id: pkg.id,
            title: pkg.title,
            image: pkg.images[0],
            price: pkg.pricing.salePrice || pkg.pricing.originalPrice,
            originalPrice: pkg.pricing.originalPrice,
            rating: pkg.rating,
            reviewCount: pkg.reviewCount,
            location: pkg.location,
            badges: pkg.badges,
            discountPercent: pkg.pricing.discountPercent,
            addedAt: new Date().toISOString()
          }]});
        }
      },
      isWishlisted: (id) => get().items.some(item => item.id === id),
      clearWishlist: () => set({ items: [] }),
      getCount: () => get().items.length,
    }),
    { name: 'kmedi-wishlist' }
  )
);
