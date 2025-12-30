
import { MapPin, Mail, Phone } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="max-w-[1400px] w-11/12 mx-auto py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Office Address */}
      <div className="flex flex-col items-start">
        <MapPin className="text-[#C5A464] bg-[#C5A464]/20 p-2 rounded-md w-10 h-10" />
        <h3 className="text-lg font-bold uppercase mt-4 text-[#111E38]">Office Address</h3>
        <p className="text-gray-500 mt-2">Lumbung Hidup Street, East Java</p>
        <div className="mt-4 text-[#C5A464]  uppercase text-sm cursor-pointer">
          View Detail
          <div className="w-28 h-[2px] bg-[#C5A464] mt-1"></div>
        </div>
      </div>

      {/* Contact Us - Black Box */}
      <div className="text-white px-8 py-6 flex flex-col items-start" style={{ backgroundColor: '#181819' }}>
        <Mail className="text-[#C5A464] bg-[#C5A464]/20 p-2 rounded-md w-10 h-10" />
        <h3 className="text-lg font-bold uppercase mt-4">Contact Us</h3>
        <p className="mt-2">info@eaglesfcgi.org</p>
        <div className="mt-4 text-[#C5A464]  uppercase text-sm cursor-pointer">
          View Detail
          <div className="w-28 h-[2px] bg-[#C5A464] mt-1"></div>
        </div>
      </div>

      {/* Telephone */}
      <div className="flex flex-col items-start">
        <Phone className="text-[#C5A464] bg-[#C5A464]/20 p-2 rounded-md w-10 h-10" />
        <h3 className="text-lg font-bold uppercase mt-4 text-[#111E38]">Telephone</h3>
        <p className="text-gray-500 mt-2">(308) 850 - 3206</p>
        <div className="mt-4 text-[#C5A464] uppercase text-sm cursor-pointer">
          View Detail
          <div className="w-28 h-[2px] bg-[#C5A464] mt-1"></div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
