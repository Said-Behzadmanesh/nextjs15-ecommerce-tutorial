import ProductsSkeleton from "./ProductsSkeleton";

export default function loading() {
  return (
    // <div className="flex justify-center items-center h-screen">
    //   <div className="animate-spin w-20 h-20 border-t-2 border-b-2 border-gray-800 rounded-full"></div>
    // </div>

    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <ProductsSkeleton />
          </div>
        ))}
      </div>
    </main>
  );
}
