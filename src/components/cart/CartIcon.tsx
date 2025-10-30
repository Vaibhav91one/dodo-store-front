"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/dodoui/badge";

interface CartIconProps {
  itemCount?: number;
  onClick: () => void;
}

export default function CartIcon({ itemCount = 3, onClick }: CartIconProps) {
  const prev = useRef(itemCount);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (itemCount > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 250);
      return () => clearTimeout(t);
    }
    prev.current = itemCount;
  }, [itemCount]);
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-[200] bg-button-secondary-bg hover:bg-button-secondary-bg-hover text-text-primary rounded-full p-4 shadow-lg transition-all hover:scale-105 active:scale-95"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <div className="relative">
        <ShoppingBag className="w-6 h-6" weight="bold" />
          {itemCount > 0 && (
           <div className={`absolute -top-2 -right-2 ${bump ? "animate-cart-bump" : ""}`}>
            <Badge
              variant="orange"
              dot={false}
              className="min-w-[20px] h-[20px] flex items-center justify-center text-xs font-bold px-1.5"
            >
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          </div>
        )}
      </div>
    </button>
  );
}

