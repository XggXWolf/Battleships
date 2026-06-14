import GameGrid from "./GameGrid";
import PlayerInfo from "./PlayerInfo";

export default function GamePanel() {
    return (
        <div className="lg:col-span-2 flex flex-col space-y-2 h-full justify-center">
            {/* Only player info has the turn indicator element, so we pass the
            current turn state to it. Opponent info does not have to receive this prop*/}
            <PlayerInfo type="player" showTurnIndicator />
            <GameGrid />
            <PlayerInfo type="opponent" showAddFriendButton />
        </div>
    );
}
