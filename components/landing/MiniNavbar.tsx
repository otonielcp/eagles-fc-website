"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MiniNavbar = () => {
  const currentPath = usePathname();

  return (
    <div className="border-b border-gray-200 shadow-lg w-full px-6">
      <div className="flex justify-center ml-0 sm:ml-[-40%] space-x-8 text-gray-500 uppercase text-sm font-medium tracking-wide">
        {/* Club Tab */}
        <Link href="/club">
          <button
            className={`py-3 relative ${currentPath === "/club" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Club
            {currentPath === "/club" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Coaches Tab */}
        <Link href="/coaches">
          <button
            className={`py-3 relative ${currentPath === "/coaches" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Coaches
            {currentPath === "/coaches" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Programs Tab */}
        <Link href="/programs">
          <button
            className={`py-3 relative ${currentPath === "/programs" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Programs
            {currentPath === "/programs" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MiniNavbar;