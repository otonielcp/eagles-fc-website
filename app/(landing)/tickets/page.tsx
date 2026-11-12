"use client";

import TicketsData from "@/components/landing/TicketsData";
import { getTickets } from "@/actions/ticket";
import { useEffect } from "react";
import { useState } from "react";
import { Ticket } from "@/types/ticket";

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>
    ([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // getTickets throws when the database is unreachable
        const tickets = await getTickets();
        setTickets(tickets);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-gray-600">
        We couldn&apos;t load tickets right now. Please try again later.
      </div>
    );
  }
  return (
    <div>
      <TicketsData tickets={tickets} />
    </div>
  );
};

export default Tickets;
