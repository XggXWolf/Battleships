import { create } from "zustand";
import type { PlayerData } from "../types/playerData";

type UserStore = {
    user: PlayerData;
    isSocketReady: boolean;
    setUser: (data: PlayerData) => void;
    setIsSocketReady: (ready: boolean) => void;
    clearUser: () => void;
};

const dummyUser: PlayerData = {
    id: "-1",
    email: "player@nomail.com",
    nickname: "Player",
    role: "user",
    isProfileComplete: true,
    elo: 0,
};

export const useUserStore = create<UserStore>((set) => ({
    user: dummyUser,
    isSocketReady: false,
    setUser: (data: PlayerData) => set({ user: data }),
    setIsSocketReady: (ready: boolean) => set({ isSocketReady: ready }),
    clearUser: () => set({ user: dummyUser }),
}));
