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

  useEffect(() => {
    const fetchTickets = async () => {
      const tickets = await getTickets();
      console.log(tickets);
      setTickets(tickets);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }
  return (
    <div>
      <TicketsData tickets={tickets} />
    </div>
  );
};

export default Tickets;
