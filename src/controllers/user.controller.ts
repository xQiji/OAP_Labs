import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

export const userRouter = Router();
const service = new UserService();

userRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(service.getAll()); } catch (error) { next(error); }
});

userRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(service.getById(String(req.params.id))); } catch (error) { next(error); }
});

userRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json(service.create(req.body)); } catch (error) { next(error); }
});

userRouter.put("/:id", (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json(service.update(String(req.params.id), req.body)); } catch (error) { next(error); }
});

userRouter.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  try { service.delete(String(req.params.id)); res.status(204).send(); } catch (error) { next(error); }
});