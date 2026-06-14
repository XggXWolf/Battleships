import { create } from "zustand";
import type { PlayerData } from "../types/playerData";

type UserStore = {
    user: PlayerData;
    setUser: (data: PlayerData) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: {
        id: "",
        email: "",
        nickname: "?",
        role: "user",
        isProfileComplete: false,
        elo: 0,
    },
    setUser: (data: PlayerData) => set({ user: data }),
}));
