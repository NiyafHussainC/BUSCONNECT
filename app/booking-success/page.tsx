import Link from "next/link";
import { CheckCircle2, Ticket, MapPin, Calendar, CreditCard, ChevronRight } from "lucide-react";

export default function BookingSuccessPage({
    searchParams,
}: {
    searchParams: {
        booking_id: string;
        bus_name: string;
        source: string;
        destination: string;
        date: string;
        payment_id: string;
        amount: string;
    };
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-sm p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8" />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight mb-2">Booking Confirmed!</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Your payment was successful and your tickets have been reserved.
                </p>

                <div className="bg-muted/30 rounded-lg p-6 space-y-4 text-left border border-border">
                    <div className="flex items-start gap-3">
                        <Ticket className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-xs text-muted-foreground tracking-wider uppercase">Booking ID</p>
                            <p className="font-mono text-sm">{searchParams.booking_id || "BKN-XXXXXX"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="font-medium text-sm">{searchParams.bus_name || "Bus Operator"}</p>
                            <p className="text-sm text-muted-foreground">{searchParams.source} to {searchParams.destination}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground tracking-wider uppercase">Travel Date</p>
                                <p className="text-sm">{searchParams.date ? new Date(searchParams.date).toLocaleDateString() : "TBD"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div className="overflow-hidden">
                                <p className="text-xs text-muted-foreground tracking-wider uppercase">Payment</p>
                                <p className="text-sm font-medium">₹{searchParams.amount || "0"}</p>
                                <p className="text-[10px] text-muted-foreground truncate w-full" title={searchParams.payment_id}>{searchParams.payment_id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3">
                    <Link
                        href="/dashboard/user/trips"
                        className="w-full flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors rounded-md"
                    >
                        View My Trips
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/"
                        className="w-full text-center py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
