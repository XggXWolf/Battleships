import { io, Socket } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const setupSocket = (socket: Socket) => {
    socket.on("connect", () => {
        (socket as any).authReady = false;
    });
    socket.on("ready", () => {
        (socket as any).authReady = true;
    });
    socket.on("disconnect", () => {
        (socket as any).authReady = false;
    });
    return socket;
};

export const chatSocket: Socket = setupSocket(io(`${BACKEND_URL}/chat`, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("access_token");
        cb({ token });
    },
}));

export const lobbySocket: Socket = setupSocket(io(`${BACKEND_URL}/lobby`, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("access_token");
        cb({ token });
    },
}));

export const gameSocket: Socket = setupSocket(io(`${BACKEND_URL}/game`, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("access_token");
        cb({ token });
    },
}));
