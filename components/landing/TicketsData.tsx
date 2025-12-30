"use client";

import { Ticket } from "@/types/ticket";
import { useMemo } from "react";

// Helper function to format date into month
const getMonthFromDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString("default", { month: "long" });
};

// Helper function to get day name
const getDayFromDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString("default", { weekday: "short" });
};

// Helper function to format date for display
const formatDateForDisplay = (dateString: string): string => {
  return new Date(dateString).getDate().toString();
};

// Helper function to get full day name
const getFullDayFromDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString("default", { weekday: "long" });
};

// Helper function to format full date (e.g., February 22, 2025)
const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

// Add this new helper function after the other helper functions
const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

const TicketsData = ({ tickets }: { tickets: Ticket[] }) => {
  const filteredTickets = tickets;

  // Get tickets with month property
  const ticketsWithMonth = useMemo(() => {
    return filteredTickets.map((ticket: Ticket) => ({
      ...ticket,
      month: getMonthFromDate(ticket.date),
      day: getDayFromDate(ticket.date),
      fullDay: getFullDayFromDate(ticket.date),
      formattedDate: formatDateForDisplay(ticket.date),
      fullDate: formatFullDate(ticket.date),
      formattedTime: formatTime(ticket.time)
    }));
  }, [filteredTickets]);

  // Get unique months
  const uniqueMonths = useMemo(() => {
    return [...new Set(ticketsWithMonth.map((ticket) => ticket.month))];
  }, [ticketsWithMonth]);

  return (
    <div className="w-8/12 mx-auto ">
      {filteredTickets.length > 0 && (
        <div>
          {/* Group by Month */}
          {uniqueMonths.map((month, index) => (
            <div key={index} className="mb-6">
              {/* Month Title */}
              <div className="flex justify-between my-14">
                <div className="w-5/12 h-[1px] bg-[#C5A464]"></div>
                <h2 className="text-[#C5A464] text-sm uppercase font-semibold">
                  {month}
                </h2>
                <div className="w-5/12 h-[1px] bg-[#C5A464]"></div>
              </div>

              {/* Ticket Cards */}
              <div className="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-24">
                {ticketsWithMonth
                  .filter((ticket) => ticket.month === month)
                  .map((ticket, idx) => {
                    // Determine if teamId is a string or an object
                    const teamName = ticket.opponentName;

                    const teamImage = ticket.opponentImage;

                    return (
                      <div
                        key={idx}
                        className="bg-white shadow-lg rounded-lg overflow-hidden w-64"
                      >
                        {/* Date & Day Header */}
                        <div className="bg-[#C5A464] text-white text-center py-1">
                          <h4 className="text-xs uppercase">{ticket.fullDay}</h4>
                          <h3 className="text-sm font-semibold">{ticket.fullDate}</h3>
                        </div>

                        {/* Team & Match Details */}
                        <div className="text-center">
                          <img
                            src={teamImage}
                            alt={teamName}
                            className="h-16 mt-5 mb-1 mx-auto"
                          />
                          <h3 className="text-md font-semibold text-[#C4A464] mb-1">
                            {teamName}
                          </h3>
                          <p className="text-xs text-[#C5A464]">
                            {ticket.stadium}
                          </p>
                          <h4 className="text-md font-semibold text-gray-500 mt-1">
                            {ticket.formattedTime}
                          </h4>
                          {ticket.description && (
                            <p className="text-xs text-gray-700 mt-1">
                              {ticket.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-700 mt-4 mb-3">
                            Presented by {ticket.sponsor}
                          </p>
                        </div>

                        {/* Buy Tickets Button */}
                        <a href={ticket.externalTicketLink} target="_blank" rel="noopener noreferrer">
                          <div className="border-t p-2 text-center">
                            <button className="text-[#C5A464] text-sm font-semibold flex items-center justify-center mx-auto">
                              <span>🎟 Buy Tickets</span>
                            </button>
                          </div>
                        </a>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsData;
