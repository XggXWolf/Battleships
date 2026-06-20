import { create } from "zustand";
import type { PlayerData } from "../types/playerData";

type UserStore = {
    user: PlayerData;
    setUser: (data: PlayerData) => void;
    clearUser: () => void;
};

const dummyUser: PlayerData = {
    id: "-1",
    email: "player@nomail.com",
    nickname: "Player",
    role: "user",
    isProfileComplete: false,
    elo: 0,
};

export const useUserStore = create<UserStore>((set) => ({
    user: dummyUser,
    setUser: (data: PlayerData) => set({ user: data }),
    clearUser: () => set({ user: dummyUser }),
}));
