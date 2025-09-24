import { Breadcrumbs } from "@/components/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

// --- FIX #1: Add generateStaticParams to pre-build all product pages ---
export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: {
      slug: true,
    },
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}
// --- END OF FIX #1 ---

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // await sleep(1000);

  const breadcrumbs = [
    {
      label: "Products",
      href: "/",
    },
    {
      label: product.category?.name,
      href: `/search/${product.category?.slug}`,
    },
    {
      label: product.name,
      href: `/product/${product.slug}`,
      active: true,
    },
  ];

  return (
    <main className="container mx-auto py-4">
      <Breadcrumbs items={breadcrumbs} />
      <Card>
        <CardContent className="p-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* <div> */}
          <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          {/* </div> */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-lg">
                {formatPrice(product.price)}
              </span>

              <Badge variant="outline">{product.category?.name}</Badge>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h2 className="font-medium">Description</h2>
              <p>{product.description}</p>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h2 className="font-medium">Availability</h2>
              <div className="flex items-center gap-2">
                {product.inventory > 0 ? (
                  <Badge variant="outline" className="text-green-600 font-bold">
                    In stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-600 font-bold">
                    Out of stock
                  </Badge>
                )}

                {product.inventory > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({product.inventory} items available)
                  </span>
                )}
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <Button disabled={product.inventory === 0} className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.inventory > 0 ? "Add to cart" : "Out of stock"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
