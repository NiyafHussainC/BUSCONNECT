import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const Razorpay = (await import('razorpay')).default;
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const body = await request.json();
        const { amount, currency = "INR", receipt } = body;

        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Send the key_id back to frontend to guarantee initialization works correctly
        return NextResponse.json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (error: any) {
        console.error("Error creating Razorpay order:", error);
        
        // Return the actual error message to the frontend for debugging
        const errorMessage = error instanceof Error 
            ? error.message 
            : (error?.error?.description || error?.description || JSON.stringify(error) || "Unknown Razorpay Error");
            
        return NextResponse.json({ error: `Razorpay Error: ${errorMessage}`, rawError: error }, { status: 500 });
    }
}
