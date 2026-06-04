export interface Ticket {
  id: number;
  theme: string;
  priority: string;
  status: string;
  authorId: number;
  description: string;
}

export interface CreateTicketDto {
  theme: string;
  priority: string;
  status: string;
  authorId: number;
  description: string;
}

export type UpdateTicketDto = Partial<CreateTicketDto>;