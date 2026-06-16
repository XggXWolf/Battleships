import { useEffect, useState } from "react";
import ErrorBanner from "./ErrorBanner";

export default function KeepAlive() {
    const [error, setError] = useState<string | null>(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const sendKeepAlive = () => {
        fetch(`${BACKEND_URL}/users/keep-alive`)
            .then((response) => {
                if (!response.ok) {
                    setError(
                        "Failed to connect to server, service might just be waking up. Trying again in a few seconds...",
                    );
                    console.error("Network response was not ok");
                } else {
                    // Clear the error if the server wakes up and responds successfully!
                    if (error) setError(null);
                }
            })
            .catch((err) => {
                setError(
                    "Failed to connect to server, service might just be waking up. Trying again in a few seconds...",
                );
                console.error(
                    "There was a problem with the fetch operation:",
                    err,
                );
            });
    };

    useEffect(() => {
        sendKeepAlive();

        const interval = setInterval(sendKeepAlive, 5 * 1000);

        return () => clearInterval(interval);
    }, []);

    return <>{error && <ErrorBanner message={error} />}</>;
}
