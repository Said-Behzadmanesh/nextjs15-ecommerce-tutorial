"use client";

import { CartItemWithProduct, setProductQuantity } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
  cartId: string;
}

export default function CartEntry({ cartItem, cartId }: CartEntryProps) {
  const [isloading, setIsLoading] = useState(false);

  const handleIncrement = async () => {
    setIsLoading(true);
    try {
      await setProductQuantity(cartItem.productId, cartItem.quantity + 1);
    } catch (error) {
      console.log("Error incrementing cart item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async () => {
    setIsLoading(true);
    try {
      await setProductQuantity(cartItem.productId, cartItem.quantity - 1);
    } catch (error) {
      console.log("Error decrementing cart item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="border-b border-muted flex py-4 justify-between">
      <div className="flex space-x-4">
        <div className="overflow-hidden rounded-md w-16 h-16 border border-muted">
          <Image
            className="h-full w-full object-cover"
            width={128}
            height={128}
            src={cartItem.product.image}
            alt={cartItem.product.name}
          />
        </div>
        <div className="flex flex-col">
          <div className="font-medium">{cartItem.product.name}</div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end gap-2">
        <p className="font-medium">{formatPrice(cartItem.product.price)}</p>
        <div className="flex items-center border border-muted rounded-full">
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={handleDecrement}
            disabled={isloading}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <p className="w-6 text-center">{cartItem.quantity}</p>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={handleIncrement}
            disabled={isloading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </li>
  );
}
