import { NavLink } from "react-router";

interface PlayButtonProps {
    name: string;
    redirectTo: string;
}

export default function PlayButton({ name, redirectTo }: PlayButtonProps) {
    return (
        <NavLink
            to={redirectTo}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 transition shadow-md whitespace-nowrap"
        >
            {name}
        </NavLink>
    );
}
