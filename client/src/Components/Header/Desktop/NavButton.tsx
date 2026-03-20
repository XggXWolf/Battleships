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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap ${primary ? "bg-blue-600 hover:bg-blue-700" : ""}`}
        >
            {name}
        </NavLink>
    );
}
