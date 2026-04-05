import NavButton from "./NavButton";

export default function DesktopNavMenu() {
    return (
        <nav id="desktop-nav" className="hidden md:flex space-x-4">
            <NavButton name="Leaderboard" redirectTo="/leaderboard" />
            <NavButton name="Shop" redirectTo="/shop" />
            <NavButton name="Play Now" redirectTo="/play" primary />
        </nav>
    );
}
