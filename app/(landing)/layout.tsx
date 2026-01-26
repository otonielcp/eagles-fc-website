import ConditionalNavbar from "@/components/landing/ConditionalNavbar";
import Footer from "@/components/landing/Footer";
import MainContentWrapper from "@/components/landing/MainContentWrapper";
import { CartProvider } from "@/app/context/CartContext";

export const dynamic = "force-dynamic";

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <CartProvider>
            <div className="relative min-h-screen">
                {/* Conditional Navbar - Transparent for landing, solid for other pages */}
                <ConditionalNavbar />
                <MainContentWrapper>{children}</MainContentWrapper>
                <Footer />
            </div>
        </CartProvider>
    );
}
