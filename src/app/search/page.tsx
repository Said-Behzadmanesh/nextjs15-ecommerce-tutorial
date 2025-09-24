import { Breadcrumbs } from "@/components/breadcrumbs";
import ProductCard from "../ProductCard";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import { Divide } from "lucide-react";
import ProductsSkeleton from "../ProductsSkeleton";

type SearchPageProps = {
  searchParams: Promise<{ query?: string }>;
};

async function Products({ query }: { query: string }) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 18,
  });

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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query?.trim() ?? "";

  const breadcrumbs = [
    { label: "Products", href: "/" },
    {
      label: `Results for "${query}"`,
      href: `/search?query=${encodeURIComponent(query)}`,
    },
  ];

  return (
    <main className="container mx-auto py-4">
      <Breadcrumbs items={breadcrumbs} />

      <Suspense key={query} fallback={<ProductsSkeleton />}>
        <Products query={query} />
      </Suspense>
    </main>
  );
}
