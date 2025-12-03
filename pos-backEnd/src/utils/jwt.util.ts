import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const createJwt = (payload: string | object | Buffer): string => {
  return (jwt.sign as any)(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyJwt = <T = any>(token: string): T => {
  return (jwt.verify as any)(token, JWT_SECRET) as T;
};
