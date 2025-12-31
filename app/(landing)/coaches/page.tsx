import CoachesList from '@/components/landing/CoachesList';
import MiniNavbar from '@/components/landing/MiniNavbar';
import { Suspense } from 'react';
import NewsletterBanner from '@/components/landing/NewsLetterBanner';

const Coaches = () => {
    return (
        <div className="bg-white">
            <MiniNavbar />
            <div className='py-8 sm:py-12'>
                <NewsletterBanner />

                <Suspense fallback={
                    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
                        <p className="text-gray-600 mt-4">Loading coaching staff...</p>
                    </div>
                }>
                    <CoachesList />
                </Suspense>

                <div className="mt-16">
                    <NewsletterBanner />
                </div>
            </div>
        </div>
    );
};

export default Coaches;
