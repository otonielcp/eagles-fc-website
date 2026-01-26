"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ContactMiniNavbar = () => {
  const location = usePathname();
  const currentPath = location;

  return (
    <div className="border-b border-gray-200 shadow-md w-full px-4 sticky top-20 z-40 bg-white">
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-gray-500 uppercase text-sm font-bold tracking-wide py-4">
        {/* Sponsorship Tab */}
        <Link href="/sponsorship">
          <button
            className={`py-2 px-4 relative transition-colors duration-300 ${
              currentPath === "/sponsorship" 
                ? "text-[#C5A464]" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sponsorship
            {currentPath === "/sponsorship" && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A464] to-[#D4B574] rounded-t-md"></div>
            )}
          </button>
        </Link>

        {/* Media Tab */}
        <Link href="/media">
          <button
            className={`py-2 px-4 relative transition-colors duration-300 ${
              currentPath === "/media" 
                ? "text-[#C5A464]" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Media
            {currentPath === "/media" && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A464] to-[#D4B574] rounded-t-md"></div>
            )}
          </button>
        </Link>

        {/* Player Inquiries Tab */}
        <Link href="/playerinquiries">
          <button
            className={`py-2 px-4 relative transition-colors duration-300 ${
              currentPath === "/playerinquiries" 
                ? "text-[#C5A464]" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Player Inquiries
            {currentPath === "/playerinquiries" && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#C5A464] to-[#D4B574] rounded-t-md"></div>
            )}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ContactMiniNavbar;
