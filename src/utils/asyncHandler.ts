import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandler = (
  requestHandler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => RequestHandler;

const asyncHandler: AsyncHandler = (requestHandler) => (req, res, next) => {
  return Promise.resolve(requestHandler(req, res, next)).catch(next);
};

export default asyncHandler;
