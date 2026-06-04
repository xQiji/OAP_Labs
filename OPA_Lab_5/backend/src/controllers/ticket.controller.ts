import { Router, Request, Response, NextFunction } from "express";
import { TicketService } from "../services/ticket.service";

export const ticketRouter = Router();
const service = new TicketService();

ticketRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const page = req.query.page ? String(req.query.page) : undefined;
    const pageSize = req.query.pageSize ? String(req.query.pageSize) : undefined;
    const result = service.getAll(status, page, pageSize);
    res.status(200).json(result);
  } catch (error) { next(error); } 
});

ticketRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const ticket = service.getById(id);
    res.status(200).json(ticket);
  } catch (error) { next(error); }
});

ticketRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const newTicket = service.create(req.body);
    res.status(201).json(newTicket); 
  } catch (error) { next(error); }
});

ticketRouter.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const updatedTicket = service.update(id, req.body);
    res.status(200).json(updatedTicket);
  } catch (error) { next(error); }
});

ticketRouter.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    service.delete(id);
    res.status(204).send(); 
  } catch (error) { next(error); }
});