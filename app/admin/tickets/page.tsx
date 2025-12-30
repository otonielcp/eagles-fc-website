'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Loader2, PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getTickets, deleteTicket } from '@/actions/ticket';
import { Ticket } from '@/types/ticket';

export default function AdminTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleDeleteTicket = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        const result = await deleteTicket(id);

        if (result.success) {
          toast.success('Ticket deleted successfully');
          setTickets(tickets.filter((ticket) => ticket._id !== id));
        } else {
          toast.error(result.error || 'Failed to delete ticket');
        }
      } catch (error) {
        console.error('Error deleting ticket:', error);
        toast.error('An error occurred while deleting the ticket');
      }
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      return (
        ticket.matchName?.toLowerCase().includes(lowercaseQuery) ||
        ticket.opponentName?.toLowerCase().includes(lowercaseQuery) ||
        ticket.stadium?.toLowerCase().includes(lowercaseQuery) ||
        (typeof ticket.teamId === 'object' && ticket.teamId?.name?.toLowerCase().includes(lowercaseQuery))
      );
    }
    return true;
  });

  // Sort tickets by date
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Group tickets into upcoming and past based on date
  const currentDate = new Date();
  const upcomingTickets = sortedTickets.filter((ticket) =>
    new Date(ticket.date) >= currentDate
  );

  const pastTickets = sortedTickets.filter((ticket) =>
    new Date(ticket.date) < currentDate
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ticket Management</h1>
        <Link href="/admin/tickets/add">
          <Button className="bg-[#C5A464] hover:bg-[#B39355]">
            <PlusCircle className="h-4 w-4 mr-2" /> Add Ticket
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>
            Manage match tickets and external ticket links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No tickets found. Add your first ticket.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Tickets */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Upcoming Tickets</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Match</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Stadium</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Ticket Link</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingTickets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No upcoming tickets found
                          </TableCell>
                        </TableRow>
                      ) : (
                        upcomingTickets.map((ticket) => (
                          <TableRow key={ticket._id}>
                            <TableCell className="font-medium">{ticket.matchName}</TableCell>
                            <TableCell>{ticket.date} at {ticket.time}</TableCell>
                            <TableCell>{ticket.stadium}</TableCell>
                            <TableCell>
                              {typeof ticket.teamId === 'object' ? ticket.teamId?.name : 'Unknown Team'}
                            </TableCell>
                            <TableCell>
                              <a
                                href={ticket.externalTicketLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#BD9B58] hover:underline truncate max-w-xs inline-block"
                              >
                                {ticket.externalTicketLink.substring(0, 30)}...
                              </a>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => router.push(`/admin/tickets/edit/${ticket._id}`)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteTicket(ticket._id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Past Tickets */}
              {pastTickets.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Past Tickets</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Match</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Stadium</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead>Ticket Link</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastTickets.map((ticket) => (
                          <TableRow key={ticket._id}>
                            <TableCell className="font-medium">{ticket.matchName}</TableCell>
                            <TableCell>{ticket.date} at {ticket.time}</TableCell>
                            <TableCell>{ticket.stadium}</TableCell>
                            <TableCell>
                              {typeof ticket.teamId === 'object' ? ticket.teamId?.name : 'Unknown Team'}
                            </TableCell>
                            <TableCell>
                              <a
                                href={ticket.externalTicketLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#BD9B58] hover:underline truncate max-w-xs inline-block"
                              >
                                {ticket.externalTicketLink.substring(0, 30)}...
                              </a>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => router.push(`/admin/tickets/edit/${ticket._id}`)}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteTicket(ticket._id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 