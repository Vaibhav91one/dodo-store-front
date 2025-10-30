"use client";

import { X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatCurrency, decodeCurrency, CurrencyCode } from "@/lib/currency-helper";
import { ProductQuantityControl } from "@/components/product/ProductQuantityControl";

interface CartItemProps {
  product_id: string;
  name: string;
  price: number;
  currency?: string;
  quantity: number;
  image?: string;
  onUpdateQuantity: (product_id: string, quantity: number) => void;
  onRemove: (product_id: string) => void;
}

export default function CartItem({
  product_id,
  name,
  price,
  currency,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const currencyCode = (currency || "USD") as CurrencyCode;
  const formattedPrice = formatCurrency(
    decodeCurrency(price, currencyCode),
    currencyCode
  );

  const subtotal = formatCurrency(
    decodeCurrency(price * quantity, currencyCode),
    currencyCode
  );

  return (
    <div className="flex gap-4 py-4 border-b border-border-tertiary">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-bg-secondary">
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-text-primary">{name}</h3>
          <p className="text-xs text-text-secondary mt-1">{formattedPrice}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <ProductQuantityControl
            quantity={quantity}
            onIncrement={() => onUpdateQuantity(product_id, quantity + 1)}
            onDecrement={() => {
              if (quantity <= 1) {
                onRemove(product_id);
              } else {
                onUpdateQuantity(product_id, quantity - 1);
              }
            }}
          />

          <span className="text-sm font-medium text-text-primary ml-auto">
            {subtotal}
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        onClick={() => onRemove(product_id)}
        variant="ghost"
        size="icon"
        aria-label="Remove item"
        className="text-text-secondary hover:text-text-primary"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
}


