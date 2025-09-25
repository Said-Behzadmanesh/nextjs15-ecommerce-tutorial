import { Breadcrumbs } from "@/components/breadcrumbs";
import { Suspense } from "react";
import ProductsSkeleton from "../ProductsSkeleton";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";

type SearchPageProps = {
  searchParams: Promise<{ query?: string; sort?: string }>;
};

// async function Products({ query, sort }: { query: string; sort?: string }) {
//   let orderBy: Record<string, "asc" | "desc"> | undefined = undefined;

//   if (sort === "price-asc") {
//     orderBy = { price: "asc" };
//   } else if (sort === "price-desc") {
//     orderBy = { price: "desc" };
//   }

//   const products = await prisma.product.findMany({
//     where: {
//       OR: [
//         { name: { contains: query, mode: "insensitive" } },
//         { description: { contains: query, mode: "insensitive" } },
//       ],
//     },
//     ...(orderBy ? { orderBy } : {}),
//     take: 18,
//   });

//   if (!products.length) {
//     return (
//       <div className="text-center text-muted-foreground">
//         <p>No results found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))}
//     </div>
//   );
// }

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query?.trim() ?? "";
  const sort = params.sort;

  const breadcrumbs = [
    { label: "Products", href: "/" },
    {
      label: `Results for "${query}"`,
      href: `/search?query=${encodeURIComponent(query)}`,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Suspense key={`${query}-${sort}`} fallback={<ProductsSkeleton />}>
        <ProductListServerWrapper params={{ query, sort }} />
      </Suspense>
    </>
  );
}
