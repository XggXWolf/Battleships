import { Outlet } from "react-router";
import Header from "./Header/Header";
import Background from "./Background/Background";

export function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Background />
        </>
    );
}

export function LayoutWithSonar() {
    return (
        <>
            <Header />
            <Outlet />
            <Background sonar />
        </>
    );
}
