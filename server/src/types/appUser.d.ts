import { JwtPayload } from 'jsonwebtoken';

export interface AppUser extends JwtPayload {
  sub: string;
  nickname: string;
  email: string;
  role: string;
  isProfileComplete: boolean;
  elo: number;
}
