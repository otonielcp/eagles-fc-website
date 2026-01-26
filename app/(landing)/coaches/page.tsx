import CoachesList from '@/components/landing/CoachesList';
import MiniNavbar from '@/components/landing/MiniNavbar';
import { Suspense } from 'react';

const Coaches = () => {
    return (
        <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <MiniNavbar />
            <div className='py-8 sm:py-12'>
                <Suspense fallback={
                    <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
                        <p className="text-gray-600 mt-4">Loading coaching staff...</p>
                    </div>
                }>
                    <CoachesList />
                </Suspense>
            </div>
        </div>
    );
};

export default Coaches;
