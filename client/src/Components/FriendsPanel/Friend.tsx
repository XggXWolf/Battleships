import truncateRank from "../../util/truncateRank";

interface FriendProps {
    //TO-DO: Define actual props for Friend component, such as friend name, status, etc.
    name: string;
    rank: string;
    status: "online" | "offline";
    elo: number;
    onFriendClick: () => void;
}

export default function Friend({
    name,
    rank,
    status,
    elo,
    onFriendClick,
}: FriendProps) {
    return (
        <>
            <a
                href="#"
                className="friend-item flex items-center justify-between px-4 py-2 hover:bg-gray-700 group transition-colors"
                onClick={onFriendClick}
            >
                <div className="flex items-center">
                    <span
                        className={`${status === "online" ? "bg-green-900/60 text-green-200 border border-green-700/50" : "bg-gray-900/60 text-gray-200 border border-gray-700/50"} px-1 rounded text-[10px] font-bold mr-2`}
                    >
                        {truncateRank(rank)}
                    </span>
                    <span className="text-sm text-white font-medium">
                        {name}
                    </span>
                </div>
                <span className="text-xs text-gray-400 font-bold">
                    ELO: {elo}
                </span>
            </a>
        </>
    );
}
