import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "@/domain/constants/HttpStatus";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};