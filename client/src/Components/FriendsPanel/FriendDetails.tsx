import dummyFriends from "../../data/dummy/friends";

interface FriendDetailsProps {
    friendId: number;
}

// Panel that shows details of a selected friend, such as their ELO rating, online status, and buttons to invite them to a game or remove them from the friends list.
//  It appears when clicking on a friend in the FriendsDropdownMenu.

export default function FriendDetails({ friendId }: FriendDetailsProps) {
    const friend = dummyFriends.find((f) => f.id === friendId);

    return (
        <div
            id="friend-details-panel"
            className="w-64 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] bg-primary border border-gray-600/50 ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
            <div className="py-1">
                <div className="px-4 py-1 text-xs font-bold text-blue-400 border-b border-gray-700">
                    — {friend?.name} —
                </div>

                <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Rating</span>
                    <span className="bg-yellow-800 text-yellow-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        ELO: {friend?.elo}
                    </span>
                </div>

                <div className="px-4 py-2 flex items-center justify-between border-t border-gray-700">
                    <span className="text-gray-400 text-xs">Status</span>
                    <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            friend?.status === "online"
                                ? "bg-green-900/60 text-green-400"
                                : "bg-gray-700 text-gray-400"
                        }`}
                    >
                        {friend?.status === "online" ? "Online" : "Offline"}
                    </span>
                </div>

                <div className="px-4 py-2 space-y-1 border-t border-gray-700 mt-1">
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 text-green-400 hover:text-green-300 transition-colors text-xs font-medium">
                        <span>Invite to Game</span>
                        <span>→</span>
                    </button>
                    <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 text-red-400 hover:text-red-300 transition-colors text-xs font-medium">
                        <span>Remove Friend</span>
                        <span>×</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
