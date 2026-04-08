export interface Ticket {
  id: number;
  theme: string;
  priority: string;
  status: string;
  author: string;
  description: string;
}

export interface CreateTicketDto {
  theme: string;
  priority: string;
  status: string;
  author: string;
  description: string;
}

export type UpdateTicketDto = Partial<CreateTicketDto>;