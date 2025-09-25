"use server";

import prisma from '@/lib/prisma';
import { Prisma } from "@/generated/prisma";
import { cookies } from 'next/headers';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';


export interface GetProductsParams {
    query?: string;
    slug?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
}

export async function getProducts({
    query,
    slug,
    sort,
    page = 1,
    pageSize = 18,
}: GetProductsParams) {
    const where: Prisma.ProductWhereInput = {};

    if (query) {
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
        ];
    }

    if (slug) {
        where.category = { slug };
    }

    let orderBy: Record<string, "asc" | "desc"> | undefined = undefined;

    if (sort === "price-asc") {
        orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
        orderBy = { price: "desc" };
    }

    const skip = pageSize ? (page - 1) * pageSize : undefined;
    const take = pageSize;

    const products = await prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
    });

    return products;
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            category: true,
        },
    });

    if (!product) return null;

    return product
}

export type CartWithProducts = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

export type ShoppingCart = CartWithProducts & {
    size: number;
    subtotal: number;
};

async function findCartFromCookie(): Promise<CartWithProducts | null> {
    const cartId = (await cookies()).get("cartId")?.value;

    if (!cartId) {
        return null;
    }

    return unstable_cache(async (id: string) => {
        return await prisma.cart.findUnique({
            where: {
                id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }, [`cart-${cartId}`], { tags: [`cart-${cartId}`] })(cartId);
}

export async function getCart(): Promise<ShoppingCart | null> {

    const cart = await findCartFromCookie();

    if (!cart) {
        return null;
    }

    return {
        ...cart,
        size: cart.items.length,
        subtotal: cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
    };
}


async function getOrCreateCart(): Promise<CartWithProducts> {
    let cart = await findCartFromCookie();

    if (cart) {
        return cart;
    }

    cart = await prisma.cart.create({
        data: {},
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        }
    });

    (await cookies()).set("cartId", cart.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return cart;
}

export async function addToCart(productId: string, quantity: number = 1) {
    if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }

    const cart = await getOrCreateCart();

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
        await prisma.cartItem.update({
            where: {
                id: existingItem.id,
            },
            data: {
                quantity: existingItem.quantity + quantity,
            },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
    }

    revalidateTag(`cart-${cart.id}`);
}