// src/types/express.d.ts
declare global {
  namespace Express {
    interface User {
      id?: string;
      email?: string;
      role?: string;
    }
    interface Request {
      user?: User;
    }
  }
}

export {};
