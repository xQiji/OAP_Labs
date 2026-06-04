import { Router, Request, Response, NextFunction } from "express";
import { CommentService } from "../services/comment.service";

export const commentRouter = Router();
const service = new CommentService();

// Отримання коментарів для конкретної заявки (через query-параметр)
commentRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticketId = req.query.ticketId ? String(req.query.ticketId) : undefined;
    if (!ticketId) {
        res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Передайте ticketId, наприклад: /api/comments?ticketId=1" } });
        return;
    }
    res.status(200).json(service.getAllByTicketId(ticketId));
  } catch (error) { next(error); }
});

commentRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(service.getById(String(req.params.id))); } catch (error) { next(error); }
});

commentRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json(service.create(req.body)); } catch (error) { next(error); }
});

commentRouter.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try { service.delete(String(req.params.id)); res.status(204).send(); } catch (error) { next(error); }
});