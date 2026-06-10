import { useEffect } from "react";
import { lobbySocket } from "../lib/socket";

export default function useLobby(onMatchFound?: () => void) {
    const joinQueue = () => lobbySocket.emit("join_queue");
    const leaveQueue = () => lobbySocket.emit("leave_queue");

    useEffect(() => {
        lobbySocket.on("match_found", () => {
            if (onMatchFound) onMatchFound();
        });

        return () => {
            lobbySocket.off("match_found");
        };
    }, [onMatchFound]);

    return { joinQueue, leaveQueue };
}
