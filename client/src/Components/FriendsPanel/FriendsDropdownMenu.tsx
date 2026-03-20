import Friend from "./Friend";
import dummyFriends from "../../data/dummy/friends";

// Dropdown menu that appears when clicking the Friends button.
// It shows the list of friends, their online status, and allows you to click on a friend to see more details or invite them to a game.
export default function FriendsDropdownMenu({
    onFriendClick,
}: {
    onFriendClick: (friendId: number | null) => void;
}) {
    const online = dummyFriends.filter((f) => f.status === "online");
    const offline = dummyFriends.filter((f) => f.status === "offline");

    return (
        <div
            id="friends-menu"
            className="w-64 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] bg-primary border border-gray-600/50 ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
            <div className="py-1">
                {online.length > 0 && (
                    <div className="px-4 py-1 text-xs font-bold text-green-400 border-b border-gray-700">
                        — Online ({online.length}) —
                    </div>
                )}

                {online.map((friend) => (
                    <Friend
                        key={friend.id}
                        {...friend}
                        onFriendClick={() => onFriendClick(Number(friend.id))}
                    />
                ))}

                {offline.length > 0 && (
                    <div className="px-4 py-1 text-xs font-bold text-gray-500 border-b border-gray-700 mt-2">
                        — Offline ({offline.length}) —
                    </div>
                )}
                {offline.map((friend) => (
                    <Friend
                        key={friend.id}
                        {...friend}
                        onFriendClick={() => onFriendClick(Number(friend.id))}
                    />
                ))}
            </div>
            <div className="border-t border-gray-700 mt-1">
                <button className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium">
                    <span>Add Friend</span>
                    <span>+</span>
                </button>
            </div>
        </div>
    );
}
