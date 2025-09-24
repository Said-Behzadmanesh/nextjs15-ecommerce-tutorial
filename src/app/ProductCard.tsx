import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Product } from "@/generated/prisma";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="pt-0 overflow-hidden min-h-[400px]">
        <div className="relative aspect-video">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <p>{formatPrice(product.price)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
