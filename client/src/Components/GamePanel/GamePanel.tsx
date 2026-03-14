import GameGrid from "./GameGrid";
import PlayerInfo from "./PlayerInfo";

export default function GamePanel() {
    return (
        <div className="lg:col-span-2 flex flex-col space-y-2 h-full justify-center">
            <PlayerInfo type="player" />
            <GameGrid />
            <PlayerInfo type="opponent" />
        </div>
    );
}
