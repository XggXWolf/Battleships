
export interface AppUser {
  sub: string;
  nickname: string;
  email: string;
  role: string;
  isProfileComplete: boolean;
  elo: number;
  exp: number;
  iat: number;
}
