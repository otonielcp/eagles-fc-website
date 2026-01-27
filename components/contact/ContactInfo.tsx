'use client';

export default function ContactInfo() {
  const contactMethods = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Us",
      details: ["info@eaglesfc.com", "admin@eaglesfc.com"],
      description: "Send us an email anytime"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Call Us",
      details: ["(308) 850-3206"],
      description: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Visit Us",
      details: [],
      description: "Come see us in person"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Office Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
      description: "Sunday: Closed"
    }
  ];

  return (
    <div className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
            <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">How To Reach Us</span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas font-black text-black uppercase tracking-wider">
            CONTACT <span className="text-[#BD9B58]">INFORMATION</span>
          </h2>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactMethods.map((method, index) => (
            <div 
              key={index}
              className="group relative bg-white border-2 border-gray-200 hover:border-[#BD9B58] p-8 transition-all duration-500 hover:shadow-xl"
            >
              {/* Top gold accent bar */}
              <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] transition-all duration-500 group-hover:w-full"></div>

              {/* Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 group-hover:bg-[#BD9B58] text-gray-600 group-hover:text-white transition-all duration-500">
                  {method.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bebas font-bold text-black uppercase tracking-wider mb-4">
                {method.title}
              </h3>

              {/* Details */}
              <div className="space-y-2 mb-4">
                {method.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-700 font-medium">
                    {detail}
                  </p>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {method.description}
              </p>

              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#BD9B58] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
