"use client";

import ProductCard from "@/app/ProductCard";
import { Product } from "@/generated/prisma";

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  if (!products.length) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
