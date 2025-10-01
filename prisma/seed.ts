import { hashPassword } from "@/lib/auth";
import { PrismaClient, Product, User } from "../src/generated/prisma";

const prisma = new PrismaClient();

export async function main() {
    console.log('Seeding database...');

    // 1. Clear existing data in the correct order to avoid foreign key constraints
    console.log('Deleting existing data...');
    await prisma.orderItem.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cart.deleteMany({});
    // Now it's safe to delete products because no OrderItems or CartItems refer to them
    await prisma.product.deleteMany({});
    console.log('Existing data deleted.');
    // await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

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
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            // image: "/images/photo-1.jpg",
            categoryId: electronics.id,
            slug: "wireless-headphones",
            inventory: 15
        },
        {
            id: "2",
            name: "Smart Watch",
            description:
                "Fitness tracker with heart rate monitoring and sleep analysis.",
            price: 149.99,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            // image: "/images/photo-2.jpg",
            categoryId: electronics.id,
            slug: "smart-watch",
            inventory: 10
        },
        {
            id: "3",
            name: "Running Shoes",
            description:
                "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            // image: "/images/photo-3.jpg",
            categoryId: clothing.id,
            slug: "running-shoes",
            inventory: 5
        },
        {
            id: "4",
            name: "Ceramic Mug",
            description:
                "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d",
            // image: "/images/photo-4.jpg",
            categoryId: home.id,
            slug: "ceramic-mug",
            inventory: 0
        },
        {
            id: "5",
            name: "Leather Backpack",
            description:
                "lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
            price: 88.99,
            image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
            // image: "/images/photo-5.jpg",
            categoryId: clothing.id,
            slug: "leather-backpack",
            inventory: 1
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    const users: User[] = [
        {
            id: "1",
            email: "admin@example.com",
            password: "password123",
            name: "Admin user",
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "2",
            email: "user@example.com",
            password: "password456",
            name: "Normal user",
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    for (const user of users) {
        const hashedPassword = await hashPassword(user.password);
        await prisma.user.create({
            data: {
                ...user,
                password: hashedPassword
            }
        });
    }

    console.log("Users created.");
}

main()
    .then(async () => {
        console.log("Seeding finished.");
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });