import { NavLink } from "react-router";
import type { NavButtonProps } from "../Props/NavButtonProps";

export default function MobileNavButton({
    name,
    redirectTo,
    primary,
}: NavButtonProps) {
    return (
        <NavLink
            to={redirectTo}
            className={`block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-gray-700 ${primary ? "bg-blue-600 hover:bg-blue-700" : ""}`}
        >
            {name}
        </NavLink>
    );
}
