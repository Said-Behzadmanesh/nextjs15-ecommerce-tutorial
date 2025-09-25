"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function SortingControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort");

  const createSortUrl = (sortValue: string | null): string => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      params.set("sort", sortValue);
    } else {
      params.delete("sort");
    }

    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ""}`;
  };
  return (
    <>
      <h3 className="text-xs text-muted-foreground mb-2">Sort By</h3>
      <ul className="">
        <li>
          <Link
            href={createSortUrl(null)}
            className={`text-sm hover.text-primary ${
              !currentSort ? "underline" : ""
            }`}
          >
            Latest
          </Link>
        </li>
        <li>
          <Link
            href={createSortUrl("price-asc")}
            className={`text-sm hover.text-primary ${
              currentSort === "price-asc" ? "underline" : ""
            }`}
          >
            Price: Low to High
          </Link>
        </li>
        <li>
          <Link
            href={createSortUrl("price-desc")}
            className={`text-sm hover.text-primary ${
              currentSort === "price-desc" ? "underline" : ""
            }`}
          >
            Price: High to Low
          </Link>
        </li>
      </ul>
    </>
  );
}
