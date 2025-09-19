import { PrismaClient, Product } from "../src/generated/prisma";

const prisma = new PrismaClient();



export async function main() {
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    const electronics = await prisma.category.create({
        data: {
            name: "Electronics",
            slug: "electronics",
        },
    });

    const clothing = await prisma.category.create({
        data: {
            name: "Clothing",
            slug: "clothing",
        },
    });

    const home = await prisma.category.create({
        data: {
            name: "Home",
            slug: "home",
        },
    });


    const products: Product[] = [
        {
            id: "1",
            name: "Wireless Headphones",
            description:
                "Premium noise-cancelling wireless headphones with long battery life.",
            price: 199.99,
            // image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            image: "/images/photo-1.jpg",
            categoryId: electronics.id,
            slug: "wireless-headphones",
        },
        {
            id: "2",
            name: "Smart Watch",
            description:
                "Fitness tracker with heart rate monitoring and sleep analysis.",
            price: 149.99,
            // image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            image: "/images/photo-2.jpg",
            categoryId: electronics.id,
            slug: "smart-watch",
        },
        {
            id: "3",
            name: "Running Shoes",
            description:
                "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            price: 89.99,
            // image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            image: "/images/photo-3.jpg",
            categoryId: clothing.id,
            slug: "running-shoes",
        },
        {
            id: "4",
            name: "Ceramic Mug",
            description:
                "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            price: 24.99,
            // image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
            image: "/images/photo-4.jpg",
            categoryId: home.id,
            slug: "ceramic-mug",
        },
        {
            id: "5",
            name: "Leather Backpack",
            description:
                "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            price: 88.99,
            // image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
            image: "/images/photo-5.jpg",
            categoryId: clothing.id,
            slug: "leather-backpack",
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }
}

main();