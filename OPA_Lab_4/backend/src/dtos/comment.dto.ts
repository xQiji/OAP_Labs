export interface Comment {
    id: number;
    body: string;
    createdAt: string;
    ticketId: number;
    authorId: number;
}

export interface CreateCommentDto {
  body: string;
  ticketId: number;
  authorId: number;
}