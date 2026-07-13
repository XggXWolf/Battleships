import { create } from "zustand";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface FriendData {
    id: string;
    nickname: string;
    elo: number;
    role: "user" | "admin";
}

type FriendsStore = {
    friends: FriendData[];
    pendingReceived: FriendData[];
    pendingSent: FriendData[];
    isLoading: boolean;
    error: string | null;
    
    fetchFriends: () => Promise<void>;
    fetchPendingRequests: () => Promise<void>;
    
    sendRequest: (targetId: string) => Promise<{ success: boolean; error?: string }>;
    acceptRequest: (requesterId: string) => Promise<{ success: boolean; error?: string }>;
    rejectRequest: (requesterId: string) => Promise<{ success: boolean; error?: string }>;
    removeFriend: (friendId: string) => Promise<{ success: boolean; error?: string }>;
    
    clearStore: () => void;
};

export const useFriendsStore = create<FriendsStore>((set, get) => ({
    friends: [],
    pendingReceived: [],
    pendingSent: [],
    isLoading: false,
    error: null,

    fetchFriends: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`${BACKEND_URL}/users/me/friends`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                set({ friends: data, isLoading: false });
            } else {
                set({ error: "Failed to fetch friends", isLoading: false });
            }
        } catch (err) {
            set({ error: "Network error", isLoading: false });
        }
    },

    fetchPendingRequests: async () => {
        set({ isLoading: true, error: null });
        try {
            const [receivedRes, sentRes] = await Promise.all([
                fetch(`${BACKEND_URL}/users/me/friend-requests`, { credentials: "include" }),
                fetch(`${BACKEND_URL}/users/me/friend-requests/sent`, { credentials: "include" })
            ]);

            if (receivedRes.ok && sentRes.ok) {
                const pendingReceived = await receivedRes.json();
                const pendingSent = await sentRes.json();
                set({ pendingReceived, pendingSent, isLoading: false });
            } else {
                set({ error: "Failed to fetch pending requests", isLoading: false });
            }
        } catch (err) {
            set({ error: "Network error", isLoading: false });
        }
    },

    sendRequest: async (targetId: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/users/me/friend-requests/${targetId}`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                await get().fetchPendingRequests();
                return { success: true };
            }
            const data = await res.json();
            return { success: false, error: data.message || "Failed to send request" };
        } catch (err) {
            return { success: false, error: "Network error" };
        }
    },

    acceptRequest: async (requesterId: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/users/me/friend-requests/${requesterId}`, {
                method: "PATCH",
                credentials: "include",
            });
            if (res.ok) {
                await Promise.all([get().fetchFriends(), get().fetchPendingRequests()]);
                return { success: true };
            }
            const data = await res.json();
            return { success: false, error: data.message || "Failed to accept request" };
        } catch (err) {
            return { success: false, error: "Network error" };
        }
    },

    rejectRequest: async (requesterId: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/users/me/friend-requests/${requesterId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                await get().fetchPendingRequests();
                return { success: true };
            }
            const data = await res.json();
            return { success: false, error: data.message || "Failed to reject request" };
        } catch (err) {
            return { success: false, error: "Network error" };
        }
    },

    removeFriend: async (friendId: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/users/me/friends/${friendId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                await get().fetchFriends();
                return { success: true };
            }
            const data = await res.json();
            return { success: false, error: data.message || "Failed to remove friend" };
        } catch (err) {
            return { success: false, error: "Network error" };
        }
    },

    clearStore: () => set({ friends: [], pendingReceived: [], pendingSent: [], error: null }),
}));
