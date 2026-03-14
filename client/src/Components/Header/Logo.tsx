import { Link } from "react-router";

export default function Logo() {
    return (
        <Link to="/">
            <div className="logo-main text-2xl font-bold tracking-wider text-blue-400">
                <span className="text-white">BATTLE</span>SHIPS
            </div>
        </Link>
    );
}
