import NavMenu from "./NavMenu/NavMenu";
import Logo from "../Logo";
import PlayerInfo from "../PlayerInfo";
import playerData from "../../../data/dummy/player";

export default function Desktop() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <Logo />
            <div className="right-panel flex items-center">
                <NavMenu />
                <PlayerInfo
                    playerRank={playerData.rank}
                    playerName={playerData.name}
                    playerElo={playerData.elo}
                />
            </div>
        </div>
    );
}
