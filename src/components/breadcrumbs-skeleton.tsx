import { Skeleton } from "./ui/skeleton";

export function BreadcrumbsSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-2">
      <Skeleton className="h-5 w-4 rounded-full" />
      <Skeleton className="h-5 w-[80px]" />
      <Skeleton className="h-5 w-[120px]" />
    </div>
  );
}
