"use client";
import { usePathname } from 'next/navigation';

export default function MainContentWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLandingPage = pathname === '/';
    
    // Landing page: no padding (navbar is transparent and overlays)
    // Other pages: padding for solid navbar (h-20 = 80px)
    return (
        <main className={isLandingPage ? '' : 'pt-20'}>
            {children}
        </main>
    );
}

