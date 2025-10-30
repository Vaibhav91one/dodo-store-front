"use client";

import { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CartItem from "./CartItem";
import type { ProductCardProps } from "@/components/product/ProductCard";
import { Package } from "@phosphor-icons/react/dist/ssr";
import { ArrowRight } from "@phosphor-icons/react";
import IconColors from "@/components/custom/icon-colors";
import { formatCurrency, decodeCurrency, CurrencyCode } from "@/lib/currency-helper";

type CartItemType = ProductCardProps & { quantity: number };

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItemType[];
  onUpdateQuantity: (product_id: string, quantity: number) => void;
  onRemove: (product_id: string) => void;
}

export default function CartSheet({ open, onOpenChange, items, onUpdateQuantity, onRemove }: CartSheetProps) {

  const handleCheckout = () => {
    alert("Checkout clicked! (Mock - not implemented yet)");
  };

  // Calculate subtotal
  const subtotal = useMemo(() => items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0), [items]);

  const formattedSubtotal = formatCurrency(
    decodeCurrency(subtotal, "USD" as CurrencyCode),
    "USD" as CurrencyCode
  );

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className=" flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-text-primary font-display">
            Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items or Empty State */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <IconColors icon={<Package className="w-12 h-12" />} />
              <h3 className="text-lg font-display font-semibold text-text-primary mt-6">
                Your cart is empty
              </h3>
              <p className="text-sm text-text-secondary text-center max-w-md mt-2">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {items.map((item) => (
                <CartItem
                  key={item.product_id}
                  {...item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="flex-col gap-5 border-t border-border-tertiary pt-4 pb-2">
            {/* Subtotal */}
            <div className="flex justify-between items-center gap-2">
              <span className="text-sm font-medium text-text-secondary">Subtotal</span>
              <span className="text-lg font-semibold text-text-primary">
                {formattedSubtotal}
              </span>
            </div>

            {/* Purchase Button (matches product card UI) */}
            <Button
              onClick={handleCheckout}
              className="w-full"
              variant="secondary"
              iconPlacement="right"
              effect="expandIcon"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Checkout
            </Button>

           
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}


