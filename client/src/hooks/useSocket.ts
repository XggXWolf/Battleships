import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";

export default function useSocket(socket: Socket) {
    const [isConnected, setConnected] = useState(socket.connected);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            setConnected(true);
            setError(null);
        });

        socket.on("disconnect", () => {
            setConnected(false);
        });

        socket.on("error", (err) => {
            setError(err.message);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("error");
            socket.disconnect();
        };
    }, []);

    return { isConnected, error };
}
