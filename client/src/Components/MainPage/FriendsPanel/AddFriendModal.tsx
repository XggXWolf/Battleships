import { useState } from "react";
import { useFriendsStore } from "../../../stores/useFriendsStore";

interface AddFriendModalProps {
    onClose: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AddFriendModal({ onClose }: AddFriendModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const { sendRequest } = useFriendsStore();

    const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setStatus("loading");
        setMessage("");

        try {
            // First find the user by nickname or id
            const findRes = await fetch(`${BACKEND_URL}/users/${searchQuery.trim()}`, {
                credentials: "include",
            });

            if (!findRes.ok) {
                setStatus("error");
                setMessage("User not found.");
                return;
            }

            const targetUser = await findRes.json();

            // Send the request
            const result = await sendRequest(targetUser.id);
            if (result.success) {
                setStatus("success");
                setMessage("Friend request sent!");
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setStatus("error");
                setMessage(result.error || "Failed to send request.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("Network error.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-sm bg-primary border border-gray-600/50 rounded-xl shadow-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h3 className="text-lg font-bold text-white mb-4">Add Friend</h3>

                <form onSubmit={handleSendRequest} className="space-y-4">
                    <div>
                        <label htmlFor="friend-search" className="block text-sm font-medium text-gray-300 mb-1">
                            Nickname or ID
                        </label>
                        <input
                            id="friend-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter nickname..."
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            autoComplete="off"
                            disabled={status === "loading" || status === "success"}
                        />
                    </div>

                    {message && (
                        <div
                            className={`text-sm px-3 py-2 rounded-lg ${
                                status === "success"
                                    ? "bg-green-900/50 text-green-400 border border-green-800"
                                    : "bg-red-900/50 text-red-400 border border-red-800"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={!searchQuery.trim() || status === "loading" || status === "success"}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors flex items-center"
                        >
                            {status === "loading" ? (
                                <span className="animate-pulse">Sending...</span>
                            ) : status === "success" ? (
                                "Sent!"
                            ) : (
                                "Send Request"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
