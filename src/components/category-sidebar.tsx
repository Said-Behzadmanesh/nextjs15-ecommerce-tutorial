import prisma from "@/lib/prisma";
import Link from "next/link";

export async function CategorySidebar({
  activeCategory,
}: {
  activeCategory?: string;
}) {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="w-[125px] flex-none">
      <h3 className="text-xs text-muted-foreground mb-2">Collections</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/search/${category.slug}`}
              className={`block text-sm font-medium ${
                activeCategory === category.slug
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
