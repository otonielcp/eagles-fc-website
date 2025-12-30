"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ContactMiniNavbar = () => {
  const location = usePathname();
  const currentPath = location;

  return (
    <div className="border-b border-gray-200 shadow-lg w-full px-4">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-gray-500 uppercase text-sm font-medium tracking-wide py-2">
        {/* Ticketing Tab */}
        <Link href="/ticketing">
          <button
            className={`py-2 px-3 relative ${currentPath === "/ticketing" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Ticketing
            {currentPath === "/ticketing" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Sponsorship Tab */}
        <Link href="/sponsorship">
          <button
            className={`py-2 px-3 relative ${currentPath === "/sponsorship" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Sponsorship
            {currentPath === "/sponsorship" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Operations Tab */}
        <Link href="/operations">
          <button
            className={`py-2 px-3 relative ${currentPath === "/operations" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Operations
            {currentPath === "/operations" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Marketing Tab */}
        <Link href="/marketing">
          <button
            className={`py-2 px-3 relative ${currentPath === "/marketing" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Marketing
            {currentPath === "/marketing" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Media Tab */}
        <Link href="/media">
          <button
            className={`py-2 px-3 relative ${currentPath === "/media" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Media
            {currentPath === "/media" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>

        {/* Player Inquiries Tab */}
        <Link href="/playerinquiries">
          <button
            className={`py-2 px-3 relative ${currentPath === "/playerinquiries" ? "text-black" : "hover:text-gray-700"
              }`}
          >
            Player Inquiries
            {currentPath === "/playerinquiries" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C5A464]"></div>
            )}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ContactMiniNavbar;
