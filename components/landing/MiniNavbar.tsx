"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MiniNavbar = () => {
  const currentPath = usePathname();

  return (
    <div className="border-b border-white/10 w-full px-6 bg-black/80 backdrop-blur-md fixed top-20 left-0 right-0 z-40">
      <div className="flex justify-center space-x-8 text-gray-400 uppercase text-sm font-medium tracking-wide">
        {/* Club Tab */}
        <Link href="/club">
          <button
            className={`py-4 relative ${currentPath === "/club" ? "text-white" : "hover:text-gray-200"
              }`}
          >
            Club
            {currentPath === "/club" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Coaches Tab */}
        <Link href="/coaches">
          <button
            className={`py-4 relative ${currentPath === "/coaches" ? "text-white" : "hover:text-gray-200"
              }`}
          >
            Coaches
            {currentPath === "/coaches" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Programs Tab */}
        <Link href="/programs">
          <button
            className={`py-4 relative ${currentPath === "/programs" ? "text-white" : "hover:text-gray-200"
              }`}
          >
            Programs
            {currentPath === "/programs" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A464]"></div>
            )}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MiniNavbar;