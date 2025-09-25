import { getProducts, GetProductsParams } from "@/lib/actions";
import { ProductList } from "./product-list";
import { sleep } from "@/lib/utils";

interface ProductListServerWrapperProps {
  params: GetProductsParams;
}

export async function ProductListServerWrapper({
  params,
}: ProductListServerWrapperProps) {
  await sleep(1000); // simulate loading time
  const products = await getProducts(params);
  return <ProductList products={products} />;
}
