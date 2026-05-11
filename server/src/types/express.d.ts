import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface User extends JwtPayload {
      id: string;
      username: string;
      email: string;
    }

    interface Request {
      user?: User;
    }
  }
}
