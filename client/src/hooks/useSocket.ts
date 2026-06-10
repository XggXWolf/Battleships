import { useEffect, useState } from "react";
import socket from "../lib/socket";

export default function useSocket() {
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
