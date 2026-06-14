import { useEffect, useRef, useState } from "react";
import DesktopNavMenu from "./Desktop/DesktopNavMenu";
import Logo from "./Logo";
import MobileNavMenu from "./Mobile/MobileNavMenu";
import PlayerInfo from "./PlayerInfo";
import MobileNavDropdownMenu from "./Mobile/MobileNavDropdownMenu";
import { NavLink, useLocation } from "react-router";
import { isTokenExpired } from "../../../util/authFunctions";
import { truncateRank } from "../../../util/rankFunctions";
import { useUserStore } from "../../../stores/useUserStore";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for auth state
    const { user } = useUserStore();

    useEffect(() => {
        if (isTokenExpired()) {
            localStorage.clear();
            setIsLoggedIn(false);
            return;
        }

        setIsLoggedIn(true);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    // Close mobile menu when navigating to a new page
    const location = useLocation();
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Track the height of the mobile menu for smooth transitions
    const [menuHeight, setMenuHeight] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (menuRef.current) {
            setMenuHeight(menuRef.current.scrollHeight);
        }
    }, []);

    return (
        <header className="bg-primary shadow-xl border-b border-color-border sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                <Logo />
                <div className="right-panel flex items-center">
                    <DesktopNavMenu />
                    <div className="hidden md:block h-5 w-px bg-gray-700 mx-4"></div>

                    {isLoggedIn ? (
                        <div className="flex items-center space-x-2 sm:space-x-4 ml-2 md:ml-8">
                            <PlayerInfo
                                playerRank={truncateRank(user.elo, user.role)}
                                playerName={user.nickname}
                                playerElo={user.elo}
                            />
                            <MobileNavMenu onClick={toggleMobileMenu} />
                        </div>
                    ) : (
                        <div id="auth-container" className="flex items-center">
                            <NavLink
                                to="/login"
                                id="login-btn"
                                className="text-sm font-semibold text-gray-400 hover:text-white transition whitespace-nowrap"
                            >
                                Sign In
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={menuRef}
                style={{
                    height: isMobileMenuOpen ? menuHeight : 0,
                    overflow: "hidden",
                    transition: "height 200ms ease",
                }}
                className="md:hidden"
            >
                <MobileNavDropdownMenu />
            </div>
        </header>
    );
}
