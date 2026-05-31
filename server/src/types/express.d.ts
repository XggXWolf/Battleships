import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface User extends JwtPayload {
      sub: string;
      nickname: string;
      email: string;
      role: string;
      isProfileComplete: boolean;
    }

    interface Request {
      user?: User;
    }
  }
}
