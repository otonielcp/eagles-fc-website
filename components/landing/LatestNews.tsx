
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
    <div className="relative bg-gradient-to-b from-white via-gray-50 to-white py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23BD9B58' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 sm:px-10 md:px-16 lg:px-32 relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-12 bg-gradient-to-b from-[#BD9B58] to-[#d4b068]"></div>
              <h2 className="text-4xl font-bebas tracking-wide text-gray-900 uppercase">Latest News</h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-[#BD9B58] to-transparent ml-4"></div>
          </div>
          <a href="/news" className="hidden md:flex items-center gap-2 text-[#BD9B58] hover:text-[#d4b068] font-semibold transition-colors duration-300 group">
            <span className="uppercase tracking-wider">More News</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Upper News Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {newsData.slice(0, 2).map((news, index) => (
            <div key={index} className="group bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 border-2 border-gray-100 hover:border-[#BD9B58]/30">
              <div className="flex flex-col sm:flex-row h-full">
                {/* Image */}
                <div className="relative w-full sm:w-1/2 overflow-hidden">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="w-full sm:w-1/2 p-6 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50 relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#BD9B58]/5 to-transparent rounded-bl-full"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bebas uppercase mb-3 text-gray-900 group-hover:text-[#BD9B58] transition-colors duration-300">{news.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{news.text}</p>
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{news.time}</span>
                    <svg className="w-6 h-6 text-[#BD9B58] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lower News Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsData.slice(2).map((news, index) => (
            <div key={index} className="group bg-white shadow-lg hover:shadow-2xl rounded-xl overflow-hidden relative flex flex-col h-80 transition-all duration-300 border-2 border-gray-100 hover:border-[#BD9B58]/30">
              {/* Image */}
              <div className="relative overflow-hidden">
                <img src={news.image} alt={news.title} className="w-full sm:h-32 h-44 object-cover transform group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-3 right-3 w-2 h-2 bg-[#BD9B58] rounded-full animate-pulse"></div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50">
                <div className="flex-grow">
                  <h3 className="text-base font-bold mb-2 text-gray-900 group-hover:text-[#BD9B58] transition-colors duration-300 line-clamp-2">{news.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{news.text}</p>
                </div>

                {/* Time - Positioned in Bottom-Left */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{news.time}</span>
                  <svg className="w-5 h-5 text-[#BD9B58] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile More News Link */}
        <a href="/news" className="md:hidden flex items-center justify-center gap-2 text-[#BD9B58] hover:text-[#d4b068] font-semibold transition-colors duration-300 mt-8 group">
          <span className="uppercase tracking-wider">More News</span>
          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default LatestNews;
