export interface PlayerData {
    id: string;
    email: string;
    nickname: string;
    role: "user" | "admin";
    isProfileComplete: boolean;
    elo: number;
}
