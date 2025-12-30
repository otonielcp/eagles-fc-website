
const logo = "/footerlogo1.png"

const NewsData = () => {
  const newsData = {
    title: "Manchester United forward Alejandro Garnacho has proudly collected his FIFA Puskas Award at Carrington, after winning the prestigious prize in late December.",
    publishInfo: {
      byline: "by Media",
      date: "Thursday 13 February 2025 15:00"
    },
    content: [
      "The accolade is given to the best goal scored in football during the qualifying period, which, in this instance, was between August 2023 and August 2024.",
      "Garna was nominated for his sensational overhead-kick against Everton at Goodison Park – an effort that was unsurprisingly named United's Goal of the Season last May.",
      "Treat yourself by watching it again below...",
      "Voting for the Puskas Award was split equally between fans and a panel of FIFA legends, with Garnacho overcoming 10 other nominated goals to claim the victory."
    ],
    secondContent: [
      "Here's a stat for you: Alejandro is only the second United player to win the Puskas Award, following on from the great Cristiano Ronaldo, during the Portuguese's first spell at the club.",
      "Our iconic former no.7 was recognised in 2009 for his electrifying long-range thunderbolt at Porto in the Champions League quarter-finals - a goal we still watch over and over again!",
      "As you can see in the image above, our 20-year-old Academy graduate has picked up his trophy at Carrington and proudly posed with it for our cameras.",
      "Garna can now add it to his burgeoning collection of winners' medals and awards at home.",
      "Congratulations on your success, Alejandro, and here's to defending your title!"
    ],
    videoUrl: "https://www.youtube.com/embed/UMaVynylXmo"
  };

  return (
    <div className="max-w-2xl mx-auto px-16 py-8">
      {/* Metadata Header */}
      <div className="flex flex-col gap-4 mb-8">
  {/* Top Section: Author & Date */}
  <div className="flex items-center justify-between border-b pb-2">
    {/* Author Section */}
    <div className="flex items-center gap-2">
      <img
        src={logo}
        alt="Author avatar"
        className="w-6 h-6 rounded-full"
      />
      <span className="text-sm text-gray-600">{newsData.publishInfo.byline}</span>
    </div>

    {/* Date Section (Right-Aligned) */}
    <p className="text-sm text-gray-500">{newsData.publishInfo.date}</p>
  </div>

  {/* Bottom Section: Social Icons */}
  <div className="flex gap-3 pt-2">
    <a href="#" className="w-6 h-6 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#181819' }}>
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>
    <a href="#" className="w-6 h-6 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity" style={{ backgroundColor: '#181819' }}>
      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
  </div>
</div>

      <article>
        {/* Title */}
        <h1 className="text-xl font-normal text-gray-900 mb-8">
          {newsData.title}
        </h1>

        {/* First section content */}
        <div className="space-y-4 mb-8">
          {newsData.content.map((paragraph, index) => (
            <p key={index} className="text-gray-700 text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* YouTube Video embed */}
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full"
              src={newsData.videoUrl}
              title="Garnacho Goal"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Second section content */}
          {newsData.secondContent.map((paragraph, index) => (
            <p key={`second-${index}`} className="text-gray-700 text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default NewsData;