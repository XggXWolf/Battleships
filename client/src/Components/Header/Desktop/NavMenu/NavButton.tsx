import { NavLink } from "react-router";

interface NavButtonProps {
    name: string;
    redirectTo: string;
}

export default function NavButton({ name, redirectTo }: NavButtonProps) {
    return (
        <NavLink
            to={redirectTo}
            className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
        >
            {name}
        </NavLink>
    );
}
