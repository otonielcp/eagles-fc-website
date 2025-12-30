import TicketForm from '@/components/admin/tickets/TicketForm';

export default function AddTicketPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Add New Ticket</h1>
      <TicketForm />
    </div>
  );
} 