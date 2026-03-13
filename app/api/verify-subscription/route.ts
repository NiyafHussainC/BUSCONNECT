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
            userId,
            planTier,
            durationDays
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

        // Payment is valid, upgrade the owner's account metadata in Prisma
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + durationDays);

        await prisma.user.update({
            where: { id: userId },
            data: {
                role: "owner", // Ensure they have owner access
                trialDaysLeft: durationDays // Repurposing this field to represent subscription validity duration for the mock
            },
        });

        return NextResponse.json({ success: true, planTier, newExpiry });
    } catch (error) {
        console.error("Subscription verification failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
