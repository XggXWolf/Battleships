import { Outlet } from "react-router";
import Header from "./Shared/Header/Header";
import Background from "./Shared/Background/Background";

interface LayoutProps {
    sonar?: boolean;
}

export function Layout({ sonar = false }: LayoutProps) {
    return (
        <>
            <Header />
            <Outlet />
            <Background sonar={sonar} />
        </>
    );
}
