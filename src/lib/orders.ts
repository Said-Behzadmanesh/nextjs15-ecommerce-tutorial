"use server";

import prisma from '@/lib/prisma';
import { getCart } from "./actions";
import { cookies } from 'next/headers';
import { createCheckoutSession, OrderWithItemsAndProduct } from './stripe';
import { auth } from './auth';

export type ProcessCheckoutResponse = {
    sessionUrl: string;
    order: OrderWithItemsAndProduct;
};

export async function processCheckout(): Promise<ProcessCheckoutResponse> {

    // these processes should be atomic
    // 1. calculate total price
    // 2. create order
    // 3. create OrderItem
    // 4. clear cart
    // 5. revalidate cache#
    // 6. return the order

    const cart = await getCart();
    const session = await auth();
    const userId = session?.user?.id;

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart not empty");
    }

    let orderId: string | null = null;

    try {
        const order = await prisma.$transaction(async (tx) => {
            const total = cart.subtotal;
            const newOrder = await tx.order.create({
                data: {
                    total,
                    userId: userId || null,
                },
            });

            const orderItems = cart.items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                orderId: newOrder.id,
                price: item.product.price,
            }));

            await tx.orderItem.createMany({
                data: orderItems,
            });

            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });

            await tx.cart.delete({
                where: {
                    id: cart.id,
                },
            });

            return newOrder;
        });

        orderId = order.id;

        // 1. reload full order
        const fullOrder = await prisma.order.findUnique({
            where: {
                id: order.id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        // 2. confirm the order was loaded
        if (!fullOrder) {
            throw new Error("Order not found");
        }
        // 3. create Stripe session
        const { sessionId, sessionUrl } = await createCheckoutSession(fullOrder);
        // 4. return session URL and handle the errors
        if (!sessionId || !sessionUrl) {
            throw new Error("Failed to create Stripe session");
        }
        // 5. store the session ID in the order & change the order status
        await prisma.order.update({
            where: {
                id: fullOrder.id,
            },
            data: {
                stripeSessionId: sessionId,
                status: "pending_payment",
            },
        });

        (await cookies()).delete("cartId");

        return {
            sessionUrl,
            order: fullOrder,
        };

    } catch (error) {
        // 1. optional: the change the order status to failed

        if (orderId && error instanceof Error && error.message.includes("Stripe")) {
            await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    status: "failed",
                },
            });
        }

        console.log("Error creating order:", error);
        throw new Error("Failed to create order");
    }
}