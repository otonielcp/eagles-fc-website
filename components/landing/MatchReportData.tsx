"use client"
import { Facebook, Twitter, Mail, Phone, Linkedin, Send } from 'lucide-react';
import { IFixture } from '@/types/fixtures';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const MatchReportData = ({
  fixture
}: {
  fixture: IFixture
}) => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Get current URL for sharing
    setCurrentUrl(window.location.href);
  }, []);

  // Process the match report content - handle both HTML and text formats
  const processMatchReportContent = () => {
    if (!fixture.matchReport) {
      return [`Match report for ${fixture.homeTeam} vs ${fixture.awayTeam} at ${fixture.stadium}.`];
    }

    // Check if content contains HTML tags (from rich text editor)
    const hasHtmlTags = /<[^>]+>/.test(fixture.matchReport);
    
    if (hasHtmlTags) {
      // It's HTML content from rich text editor, return as single item
      return [fixture.matchReport];
    } else {
      // It's plain text, split by paragraphs
      return fixture.matchReport.split('\n\n').filter(p => p.trim().length > 0);
    }
  };

  const reportParagraphs = processMatchReportContent();

  // Create timeline summary from the fixture's timeline events
  const timelineEvents = fixture.timeline?.map(event => {
    let eventText = '';

    switch (event.type) {
      case 'goal':
        eventText = `${event.time}' GOAL! ${event.player} (${event.team})`;
        if (event.assistedBy) eventText += ` assisted by ${event.assistedBy}`;
        break;
      case 'yellowcard':
        eventText = `${event.time}' Yellow card: ${event.player} (${event.team})`;
        break;
      case 'redcard':
        eventText = `${event.time}' Red card: ${event.player} (${event.team})`;
        break;
      default:
        eventText = `${event.time}' ${event.description || event.type}: ${event.player} (${event.team})`;
    }

    return eventText;
  }) || [];

  const reportData = {
    title: `${fixture.homeTeam} ${fixture.homeScore}-${fixture.awayScore} ${fixture.awayTeam} in ${fixture.competition}`,
    publishDate: new Date(fixture.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).toUpperCase(),
    author: "MATCH REPORT",
    content: reportParagraphs,
    timelineEvents: timelineEvents,
    nextMatch: {
      info: `Upcoming ${fixture.homeTeam} matches will be posted here.`,
      link: "view fixtures"
    }
  };

  // Clean up team names by removing extra spaces
  const cleanTeamName = (name: string) => name.replace(/\s+/g, ' ').trim();
  
  // Sharing functions
  const shareData = {
    title: `${cleanTeamName(fixture.homeTeam)} ${fixture.homeScore}-${fixture.awayScore} ${cleanTeamName(fixture.awayTeam)}`,
    competition: fixture.competition,
    stadium: fixture.stadium,
    date: new Date(fixture.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    url: currentUrl
  };

  const handleFacebookShare = () => {
    const shareTitle = `MATCH REPORT: ${shareData.title} | ${shareData.competition}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&t=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const text = `MATCH REPORT: ${shareData.title}\nVenue: ${shareData.stadium}\nCompetition: ${shareData.competition}\nDate: ${shareData.date}\n\nRead the full match report:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Match Report: ${shareData.title}`);
    const body = encodeURIComponent(
      `Hi,\n\nCheck out this match report:\n\n` +
      `RESULT: ${shareData.title}\n` +
      `COMPETITION: ${shareData.competition}\n` +
      `VENUE: ${shareData.stadium}\n` +
      `DATE: ${shareData.date}\n\n` +
      `Read the full report here: ${currentUrl}\n\n` +
      `Best regards`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*MATCH REPORT*\n\n` +
      `RESULT: ${shareData.title}\n` +
      `COMPETITION: ${shareData.competition}\n` +
      `VENUE: ${shareData.stadium}\n` +
      `DATE: ${shareData.date}\n\n` +
      `Read the full match report: ${currentUrl}`
    );
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(
      `MATCH REPORT: ${shareData.title}\n\n` +
      `COMPETITION: ${shareData.competition}\n` +
      `VENUE: ${shareData.stadium}\n` +
      `DATE: ${shareData.date}`
    );
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${text}`;
    window.open(url, '_blank');
  };

  // Render content based on type (HTML or text)
  const renderContent = (content: string, index: number) => {
    const hasHtmlTags = /<[^>]+>/.test(content);
    
    if (hasHtmlTags) {
      return (
        <div
          key={index}
          className="text-gray-700 text-sm leading-relaxed rich-text-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    } else {
      return (
        <div
          key={index}
          className="text-gray-700 text-sm leading-relaxed"
        >
          {content}
        </div>
      );
    }
  };

  return (
    <>
      {/* Add styles for rich text content */}
      <style jsx global>{`
        .rich-text-content h1 {
          font-size: 1.875rem;
          font-weight: bold;
          margin: 1.5rem 0 1rem 0;
          color: #1f2937;
        }
        .rich-text-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1.25rem 0 0.75rem 0;
          color: #1f2937;
        }
        .rich-text-content h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
          color: #1f2937;
        }
        .rich-text-content p {
          margin: 0.75rem 0;
          line-height: 1.625;
          color: #374151;
        }
        .rich-text-content ul, .rich-text-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .rich-text-content li {
          margin: 0.25rem 0;
          color: #374151;
        }
        .rich-text-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
          font-style: italic;
        }
        .rich-text-content strong {
          font-weight: 600;
          color: #1f2937;
        }
        .rich-text-content em {
          font-style: italic;
        }
        .rich-text-content u {
          text-decoration: underline;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-normal text-gray-900 mb-8">
          {reportData.title}
        </h1>

        {/* Match Summary Section */}
        <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Match Summary</h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">{fixture.homeTeam}</span> {fixture.homeScore} - {fixture.awayScore} <span className="font-semibold">{fixture.awayTeam}</span>
            </p>
            <p className="text-gray-600">
              {fixture.competition} | {fixture.stadium} | {new Date(fixture.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Match Report Content */}
        <div className="prose prose-sm max-w-none mb-8">
          <p className="text-sm text-gray-600 mb-6">
            Match report for {fixture.homeTeam} vs {fixture.awayTeam} at {fixture.stadium}.
          </p>

          <div className="space-y-4">
            {reportData.content.map((content, index) => renderContent(content, index))}
          </div>
        </div>

        {/* Timeline Events */}
        {reportData.timelineEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Key Match Events</h2>
            <ul className="list-disc pl-5 space-y-2">
              {reportData.timelineEvents.map((event, index) => (
                <li key={index} className="text-gray-700 text-sm">{event}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Match Section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="text-base font-bold mb-3">Next up</h3>
          <p className="text-sm text-gray-700">
            {reportData.nextMatch.info}{' '}
            <Link href="/fixtures" className="text-red-600 hover:underline font-medium">
              {reportData.nextMatch.link}
            </Link>
            .
          </p>
        </div>

        {/* Footer with Metadata and Share */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Metadata */}
            <div className="text-xs text-gray-500 uppercase space-y-1">
              <p>PUBLISHED · {reportData.publishDate}</p>
              <p>{reportData.author}</p>
            </div>

            {/* Share Buttons */}
            <div>
              <p className="text-xs text-gray-500 uppercase mb-3">SHARE</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleFacebookShare}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: '#181819' }}
                  aria-label="Share on Facebook"
                >
                  <Facebook size={18} className="text-white" />
                </button>
                <button
                  onClick={handleTwitterShare}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: '#181819' }}
                  aria-label="Share on Twitter"
                >
                  <Twitter size={18} className="text-white" />
                </button>
                <button
                  onClick={handleEmailShare}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  aria-label="Share via Email"
                >
                  <Mail size={18} className="text-gray-700" />
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  aria-label="Share on WhatsApp"
                >
                  <Phone size={18} className="text-white" />
                </button>
                <button
                  onClick={handleLinkedInShare}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: '#181819' }}
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin size={18} className="text-white" />
                </button>
                <button
                  onClick={handleTelegramShare}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  aria-label="Share on Telegram"
                >
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchReportData;