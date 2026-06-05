import { JwtPayload } from 'jsonwebtoken';
import { AppUser } from './appUser';

declare global {
  namespace Express {
    export interface User extends AppUser {}

    interface Request {
      user?: User;
    }
  }
}
