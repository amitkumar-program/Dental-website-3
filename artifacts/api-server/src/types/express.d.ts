import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string | null;
        isAdmin: boolean;
      } | null;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string | null;
      isAdmin: boolean;
    } | null;
  }
}


