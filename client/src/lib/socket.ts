import { io, Socket } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const socket: Socket = io(`${BACKEND_URL}/chat`, {
    autoConnect: false,
    auth: (cb) => {
        const token = localStorage.getItem("access_token");
        cb({ token });
    },
});

export default socket;
