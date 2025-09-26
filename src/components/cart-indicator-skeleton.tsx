import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

export async function CartIndicatorSkeleton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="relative animate-pulse"
      disabled
    >
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5" />
      </Link>
    </Button>
  );
}
