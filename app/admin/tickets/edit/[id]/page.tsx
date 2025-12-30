import TicketForm from '@/components/admin/tickets/TicketForm';

interface EditTicketPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTicketPage({ params }: EditTicketPageProps) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Edit Ticket</h1>
      <TicketForm ticketId={id} />
    </div>
  );
} 