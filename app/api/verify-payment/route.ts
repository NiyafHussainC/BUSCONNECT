import { NextResponse } from "next/server";



export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { default: prisma } = await import('@/lib/prisma');
        const crypto = await import('crypto');
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            tripId,
            userId,
            amount,
        } = body;

        const secret = process.env.RAZORPAY_KEY_SECRET!;

        // Generate expected signature
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
        }

        // Payment is valid, save to database
        // 1. Create Payment record
        const payment = await prisma.payment.create({
            data: {
                tripId,
                userId,
                razorpay_order_id,
                razorpay_payment_id,
                amount: amount / 100, // convert back from paise to rupees
                status: "completed",
            },
        });

        // 2. Update Trip to mark payment complete
        await prisma.trip.update({
            where: { id: tripId },
            data: {
                paymentStatus: "paid",
                status: "booked", // escalate trip status
                totalPaid: amount / 100,
            },
        });

        return NextResponse.json({ success: true, payment });
    } catch (error) {
        console.error("Payment verification failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
