import { NavLink } from "react-router";
import type { NavButtonProps } from "../Props/NavButtonProps";

export default function NavButton({
    name,
    redirectTo,
    primary,
}: NavButtonProps) {
    return (
        <NavLink
            to={redirectTo}
            className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    primary
                        ? "bg-blue-600 hover:bg-blue-700"
                        : isActive
                          ? "bg-blue-900/50 text-blue-300 border border-blue-700/50"
                          : "hover:bg-gray-700"
                }`
            }
        >
            {name}
        </NavLink>
    );
}
