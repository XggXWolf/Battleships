export default function LobbyPanel() {
    return (
        <div id="lobby-panel" className="flex flex-col space-y-4 h-full">
            <h3 className="text-xl font-bold text-center text-blue-400 border-b border-gray-700 pb-3 mb-2">
                Welcome, Commander!
            </h3>
            <p className="text-center text-gray-400">
                Select a game mode to start
            </p>
            <button
                id="play-ranked-btn"
                className="w-full py-4 text-lg font-bold rounded-xl bg-green-600 hover:bg-green-700 transition shadow-xl transform hover:scale-[1.02]"
            >
                ▶️ Play Ranked Match
            </button>
            <button className="w-full py-4 text-lg font-bold rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-xl">
                🤝 Invite Friend
            </button>
            <button className="w-full py-4 text-lg font-bold rounded-xl bg-orange-600 hover:bg-orange-700 transition shadow-xl">
                🤖 VS AI
            </button>
            <div className="grow"></div>
            <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-700">
                Current Online Players: 1234
            </div>
        </div>
    );
}
