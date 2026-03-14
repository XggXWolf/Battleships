import NavButton from "./NavButton";
import PlayButton from "./PlayButton";

export default function NavMenu() {
    return (
        <nav id="desktop-nav" className="hidden md:flex space-x-4">
            <NavButton name="Leaderboard" redirectTo="/leaderboard" />
            <NavButton name="Shop" redirectTo="/shop" />
            <PlayButton name="Play Now" redirectTo="/play" />
        </nav>
    );
}
