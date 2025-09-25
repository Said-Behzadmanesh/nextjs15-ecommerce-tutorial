import { CategorySidebar } from "@/components/category-sidebar";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { SortingControls } from "@/components/sorting-controls";

async function CategorySidebarServerWrapper() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <CategorySidebar categories={categories} />;
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto py-4">
      <div className="flex gap-8">
        <div className="w-[125px] flex-none">
          <Suspense fallback={<div className="w-[125px]">Loading...</div>}>
            <CategorySidebarServerWrapper />
          </Suspense>
        </div>
        <div className="flex-1">{children}</div>
        <div className="w-[125px] flex-none">
          <SortingControls />
        </div>
      </div>
    </main>
  );
}
