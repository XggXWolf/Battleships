import { useState } from "react";

export default function FriendsDropdown() {
    const [open, setOpen] = useState(false);

    function toggleDropdown() {
        setOpen((prev) => !prev);
    }

    return (
        <div className="fixed bottom-3 right-3 z-20 flex flex-col items-end space-y-2">
            <div
                className={`transition-all duration-200 ${
                    open
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 pointer-events-none"
                }`}
            >
                <div className="bg-primary border border-color-border rounded-lg shadow-lg p-4">
                    <p className="text-gray-100">Friends</p>
                </div>
            </div>

            <button
                id="friends-dropdown-btn"
                className="relative p-3 rounded-lg bg-primary border border-color-border hover:border-gray-500 text-gray-400 hover:text-white shadow-lg transition"
                onClick={toggleDropdown}
            >
                <div className="relative flex items-center justify-center">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500/50 rounded-full text-xs flex items-center justify-center text-white font-bold">
                        5
                    </span>
                </div>
            </button>
        </div>
    );
}
