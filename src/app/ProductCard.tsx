import { Product } from "@/lib/mocks";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover object-center mb-4"
      />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <p className="text-gray-500">{product.description}</p>
    </div>
  );
};

export default ProductCard;
