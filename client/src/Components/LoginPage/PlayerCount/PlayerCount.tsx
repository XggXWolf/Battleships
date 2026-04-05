import "./PlayerCount.css";

export default function PlayerCount() {
    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            <div className="dot-online"></div>
            <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase">
                2,841 Players Online
            </span>
        </div>
    );
}
