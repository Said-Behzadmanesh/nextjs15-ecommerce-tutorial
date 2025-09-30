import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const payload = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
        return new NextResponse("Missing Stripe signature", { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new NextResponse("Missing Stripe webhook secret", { status: 400 });
    }

    try {
        const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;

            if (!orderId) {
                console.error("No order id found in session metadata");
                return new NextResponse("No order id found in session metadata", { status: 400 });
            }

            await prisma.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: "paid",
                    stripePaymentIntentId: session.payment_intent as string,
                }
            });

        } else {
            console.warn(`unhandled event type: ${event.type}`);
        }

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        console.error(`Error verifying Stripe webhook: ${error}`);
        return new NextResponse("Webhook Error", { status: 400 });
    }
}