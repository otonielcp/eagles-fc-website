export interface TicketFormData {
  matchName: string;
  date: string;
  time: string;
  stadium: string;
  teamId: string;
  opponentName: string;
  opponentImage: string;
  externalTicketLink: string;
  description: string;
  sponsor: string;
}

export interface Ticket {
  _id: string;
  matchName: string;
  date: string;
  time: string;
  stadium: string;
  teamId: {
    _id: string;
    name: string;
    shortName: string;
    image?: string;
  } | string;
  opponentName: string;
  opponentImage: string;
  externalTicketLink: string;
  description: string;
  sponsor: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketResponse {
  success: boolean;
  ticket?: Ticket;
  error?: string;
} 