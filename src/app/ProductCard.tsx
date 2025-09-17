import { Product } from "@/lib/mocks";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="relative aspect-video">
        <Image
          src={product.image}
          alt={product.name}
          className="object-cover"
          fill
        />
      </div>
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600">{formatPrice(product.price)}</p>
      <p className="text-gray-500">{product.description}</p>
    </div>
  );
};

export default ProductCard;
