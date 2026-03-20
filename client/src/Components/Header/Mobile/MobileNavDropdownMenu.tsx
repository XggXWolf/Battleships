import MobileNavButton from "./MobileNavButton";

export default function MobileNavDropdownMenu() {
    return (
        <nav
            id="mobile-nav-menu"
            className="block md:hidden px-4 pt-2 pb-4 space-y-2 border-t border-color-border bg-primary"
        >
            <MobileNavButton name="Leaderboard" redirectTo="/leaderboard" />
            <MobileNavButton name="Shop" redirectTo="/shop" />
            <MobileNavButton name="Play Now" redirectTo="/play" primary />
        </nav>
    );
}
