// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import ProductCard from "./ProductCard";
// import prisma from "@/lib/prisma";
// import { Breadcrumbs } from "@/components/breadcrumbs";

// type HomePageProps = {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };
// const pageSize = 3;

// // Cleaned up props signature
// export default async function HomePage({
//   searchParams: searchParamsPromise,
// }: HomePageProps) {
//   // Accessing searchParams makes this page dynamic, which is correct.

//   const searchParams = await searchParamsPromise;
//   const page = Number(searchParams?.page) || 1;
//   const skip = (page - 1) * pageSize;

//   // This is the correct, efficient way to fetch data in parallel.
//   const [products, total] = await prisma.$transaction([
//     prisma.product.findMany({
//       skip,
//       take: pageSize,
//     }),
//     prisma.product.count(),
//   ]);

//   const totalPages = Math.ceil(total / pageSize);
//   const hasPreviousPage = page > 1;
//   const hasNextPage = page < totalPages;

//   return (
//     <main className="container mx-auto py-4">
//       {/* <h1 className="text-3xl font-bold mb-6">Home</h1> */}
//       <Breadcrumbs items={[{ label: "Products", href: "/" }]} />

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>

//       <Pagination className="mt-8">
//         <PaginationContent>
//           {hasPreviousPage && (
//             <PaginationItem>
//               <PaginationPrevious href={`?page=${page - 1}`} />
//             </PaginationItem>
//           )}

//           {Array.from({ length: totalPages }).map((_, index) => (
//             <PaginationItem key={index}>
//               <PaginationLink
//                 href={`?page=${index + 1}`}
//                 isActive={index + 1 === page}
//               >
//                 {index + 1}
//               </PaginationLink>
//             </PaginationItem>
//           ))}

//           {hasNextPage && (
//             <PaginationItem>
//               <PaginationNext href={`?page=${page + 1}`} />
//             </PaginationItem>
//           )}
//         </PaginationContent>
//       </Pagination>
//     </main>
//   );
// }

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Suspense } from "react";
import ProductsSkeleton from "./ProductsSkeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductListServerWrapper } from "@/components/ProductListServerWrapper";
// import { getProductsCountCached } from "@/lib/actions";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const pageSize = 3;

export default async function HomePage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;

  const total = await prisma.product.count();
  const totalPages = Math.ceil(total / pageSize);

  // console.log(await stripe.events.list({ limit: 1 }));

  return (
    <main className="container mx-auto py-4">
      <Breadcrumbs items={[{ label: "Products", href: "/" }]} />

      <Suspense key={page} fallback={<ProductsSkeleton />}>
        <ProductListServerWrapper params={{ page, pageSize }} />
      </Suspense>

      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`?page=${page - 1}`} />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href={`?page=${index + 1}`}
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext href={`?page=${page + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
