import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { getCart } from "@/lib/actions";

export async function CartIndicator() {
  const cart = await getCart();
  const cartSize = cart?.size ?? 0;

  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5" />
        {cartSize > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center text-white">
            {cartSize}
          </span>
        )}
      </Link>
    </Button>
  );
}
