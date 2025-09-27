"use server";

import { getCart } from "./actions";

export async function createOrder() {
    const cart = await getCart();

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart not empty");
    }

    // TODO: these processes should be atomic
    // 1. calculate total price
    // 2. create order
    // 3. create OrderItem
    // 4. clear cart
    // 5. revalidate cache#
    // 6. return the order

}