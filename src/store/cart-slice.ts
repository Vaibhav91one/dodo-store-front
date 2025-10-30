import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ProductCardProps } from "@/components/product/ProductCard";

export type CartItem = ProductCardProps & { quantity: number };

type CartState = {
  isOpen: boolean;
  items: CartItem[];
};

const initialState: CartState = {
  isOpen: false,
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart(state) {
      state.isOpen = true;
    },
    closeCart(state) {
      state.isOpen = false;
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    addItem(state, action: PayloadAction<ProductCardProps>) {
      const existing = state.items.find((i) => i.product_id === action.payload.product_id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    updateQuantity(state, action: PayloadAction<{ product_id: string; quantity: number }>) {
      const item = state.items.find((i) => i.product_id === action.payload.product_id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.product_id !== action.payload.product_id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    removeItem(state, action: PayloadAction<{ product_id: string }>) {
      state.items = state.items.filter((i) => i.product_id !== action.payload.product_id);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { openCart, closeCart, toggleCart, addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

