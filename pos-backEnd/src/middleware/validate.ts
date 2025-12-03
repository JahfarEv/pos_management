import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import ApiError from "../utils/ApiError";

const validate =
  (schema: Schema) => (req: Request, _res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });
    if (error) {
      const message = error.details.map((d) => d.message).join(", ");
      return next(new ApiError(400, message));
    }
    req.body = value;

    next();
  };

export default validate;
