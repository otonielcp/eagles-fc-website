import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Private methods
  calculateTotals: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isOpen: false,

      addToCart: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item._id === product._id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...product, quantity }],
          });
        }
        
        get().calculateTotals();
      },

      removeFromCart: (productId: string) => {
        set({
          items: get().items.filter(item => item._id !== productId),
        });
        get().calculateTotals();
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set({
          items: get().items.map(item =>
            item._id === productId ? { ...item, quantity } : item
          ),
        });
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      calculateTotals: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        set({ total, itemCount });
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items,
        total: state.total,
        itemCount: state.itemCount,
      }),
      onRehydrateStorage: () => (state) => {
        // Recalculate totals after rehydration
        state?.calculateTotals();
      },
    }
  )
);