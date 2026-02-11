import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (pkg, options = {}) => {
        const items = get().items;
        const existing = items.find(item => item.packageId === pkg.id);
        if (existing) {
          set({ items: items.map(item =>
            item.packageId === pkg.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )});
        } else {
          set({ items: [...items, {
            id: Date.now().toString(),
            packageId: pkg.id,
            title: pkg.title,
            image: pkg.images[0],
            price: pkg.pricing.salePrice || pkg.pricing.originalPrice,
            originalPrice: pkg.pricing.originalPrice,
            quantity: 1,
            options,
            addedAt: new Date().toISOString()
          }]});
        }
      },
      removeItem: (id) => set({ items: get().items.filter(item => item.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) return get().removeItem(id);
        set({ items: get().items.map(item => item.id === id ? { ...item, quantity } : item) });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'kmedi-cart' }
  )
);
