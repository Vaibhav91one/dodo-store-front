"use client";

import { useMemo } from "react";
import CartIcon from "./CartIcon";
import CartSheet from "./CartSheet";
import type { ProductCardProps } from "@/components/product/ProductCard";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { closeCart, openCart, updateQuantity, removeItem } from "@/store/cart-slice";

export default function CartWrapper({}: { initialItems?: ProductCardProps[] }) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.cart.isOpen);
  const items = useAppSelector((s) => s.cart.items);
  const totalCount = useMemo(() => items.reduce((sum, i) => sum + (i.quantity || 0), 0), [items]);

  return (
    <>
      <CartIcon itemCount={totalCount} onClick={() => dispatch(openCart())} />
      <CartSheet
        open={isOpen}
        onOpenChange={(open) => (open ? dispatch(openCart()) : dispatch(closeCart()))}
        items={items}
        onUpdateQuantity={(id, q) => dispatch(updateQuantity({ product_id: id, quantity: Math.max(0, q) }))}
        onRemove={(id) => dispatch(removeItem({ product_id: id }))}
      />
    </>
  );
}


