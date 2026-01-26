
const newsimage1 = "/newspics/newsimage1.png"
const newsimage2 = "/newspics/newsimage2.png"
const newsimage3 = "/newspics/newsimage3.png"
const newsimage4 = "/newspics/newsimage4.png"
const newsimage5 = "/newspics/newsimage5.png"
const newsimage6 = "/newspics/newsimage6.png"

const newsData = [
  { image: newsimage1, title: 'Amorim Reveals Chats with Sir Alex', text: 'Ruben says he has spoken with our legendary former manager...', time: '10h | news' },
  { image: newsimage2, title: 'Snapdragon and United Join Forces with (RED)', text: 'Our front-of-shirt sponsor can nominate a charity...', time: '2h | news' },
  { image: newsimage3, title: 'How to Sign Our Book of Condolence', text: 'Fans can write tributes to Denis Law from Monday to Friday...', time: '5h | news' },
  { image: newsimage4, title: 'United Review Pays Tribute to Denis Law', text: 'Read all about a special edition of the matchday programme...', time: '3h | news' },
  { image: newsimage5, title: 'Amorim: This is Not Acceptable', text: 'The boss responds to the home defeat to Brighton...', time: '1d | interviews' },
  { image: newsimage6, title: 'I\'m Buzzing - and Want to Continue Like This!', text: 'Ella Toone sets out her stall for our upcoming matches...oone sets out her stall for our upcoming matches', time: '3h | interviews' }
];

const LatestNews = () => {
  return (
    <div className="relative bg-white py-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C5A464' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#C5A464]"></div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tight">
              Latest News
            </h2>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#C5A464]"></div>
          </div>
          <p className="text-gray-500 text-sm md:text-base uppercase tracking-widest font-semibold">
            Club News & Announcements
          </p>
        </div>

        {/* Featured News - Top 2 Large Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {newsData.slice(0, 2).map((news, index) => (
            <a 
              href="/news" 
              key={index} 
              className="group bg-white shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 border border-gray-200 hover:border-[#C5A464] transform hover:-translate-y-2"
            >
              <div className="relative">
                {/* Image */}
                <div className="relative overflow-hidden h-64 md:h-80">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-white text-2xl md:text-3xl font-bold uppercase mb-3 leading-tight group-hover:text-[#C5A464] transition-colors duration-300">
                      {news.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base mb-4 leading-relaxed line-clamp-2">
                      {news.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-bold text-[#C5A464] uppercase tracking-wider">
                        {news.time}
                      </span>
                      <svg className="w-6 h-6 text-[#C5A464] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Grid News - Bottom 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsData.slice(2).map((news, index) => (
            <a 
              href="/news"
              key={index} 
              className="group bg-white shadow-lg hover:shadow-2xl rounded-xl overflow-hidden transition-all duration-500 border border-gray-200 hover:border-[#C5A464] transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 right-3 w-2 h-2 bg-[#C5A464] rounded-full animate-pulse shadow-lg"></div>
              </div>

              {/* Content */}
              <div className="p-5 bg-gradient-to-b from-white to-gray-50">
                <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#C5A464] transition-colors duration-300 mb-2 line-clamp-2 uppercase">
                  {news.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4">
                  {news.text}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {news.time}
                  </span>
                  <svg className="w-5 h-5 text-[#C5A464] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* View All News Button */}
        <div className="text-center mt-12">
          <a 
            href="/news" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C5A464] to-[#D4B574] hover:from-[#B39355] hover:to-[#C5A464] text-white font-bold text-base md:text-lg px-10 py-4 rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            View All News
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
