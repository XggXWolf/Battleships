import FriendsMenuButton from "../../Components/MainPage/FriendsPanel/FriendsMenuButton";
import GamePanel from "../../Components/MainPage/GamePanel/GamePanel";
import SidePanel from "../../Components/MainPage/SidePanel/SidePanel";
import GameSession from "../../game/GameSession";
import { useGameStore } from "../../stores/useGameStore";

function Main() {
    const gameId = useGameStore((s) => s.gameId);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 min-h-0 flex flex-col overflow-x-hidden overflow-y-auto">
            {" "}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
                {gameId && <GameSession />}
                <GamePanel />
                <SidePanel />
                <FriendsMenuButton />
            </div>
        </main>
    );
}
export default Main;
