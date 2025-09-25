"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Product } from "@/generated/prisma";
import { addToCart } from "@/lib/actions";

export function AddToCartButton({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCart(product.id, 1);
    } catch (error) {
      console.log("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={product.inventory === 0 || isAdding}
      className="w-full"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {product.inventory > 0 ? "Add to cart" : "Out of stock"}
    </Button>
  );
}
