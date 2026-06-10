import { io, Socket } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const chatSocket: Socket = io(`${BACKEND_URL}/chat`, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("access_token");
        cb({ token });
    },
});
export const lobbySocket: Socket = io(`${BACKEND_URL}/lobby`, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("access_token");
        cb({ token });
    },
});

export const gameSocket: Socket = io(`${BACKEND_URL}/game`, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("access_token");
        cb({ token });
    },
});
