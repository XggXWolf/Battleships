import Friend from "./Friend";
import { useFriendsStore } from "../../../stores/useFriendsStore";

export default function FriendsDropdownMenu({
    onFriendClick,
    onAddFriendClick,
}: {
    onFriendClick: (friendId: string | null) => void;
    onAddFriendClick: () => void;
}) {
    const { friends, pendingReceived } = useFriendsStore();

    return (
        <div
            id="friends-menu"
            className="w-64 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] bg-primary border border-gray-600/50 ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
            <div className="py-1 max-h-64 overflow-y-auto">
                {pendingReceived.length > 0 && (
                    <>
                        <div className="px-4 py-1 text-xs font-bold text-yellow-500 border-b border-gray-700">
                            — Pending Requests ({pendingReceived.length}) —
                        </div>
                        {pendingReceived.map((friend) => (
                            <Friend
                                key={friend.id}
                                name={friend.nickname}
                                elo={friend.elo}
                                onFriendClick={() => onFriendClick(friend.id)}
                            />
                        ))}
                    </>
                )}

                {friends.length > 0 && (
                    <div className="px-4 py-1 text-xs font-bold text-gray-500 border-b border-gray-700 mt-2">
                        — Friends ({friends.length}) —
                    </div>
                )}
                {friends.map((friend) => (
                    <Friend
                        key={friend.id}
                        name={friend.nickname}
                        elo={friend.elo}
                        onFriendClick={() => onFriendClick(friend.id)}
                    />
                ))}

                {friends.length === 0 && pendingReceived.length === 0 && (
                    <div className="px-4 py-4 text-xs text-center text-gray-500">
                        No friends yet. Add some!
                    </div>
                )}
            </div>
            <div className="border-t border-gray-700 mt-1">
                <button 
                    onClick={onAddFriendClick}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 text-blue-400 hover:text-blue-300 transition-colors text-xs font-medium"
                >
                    <span>Add Friend</span>
                    <span>+</span>
                </button>
            </div>
        </div>
    );
}
