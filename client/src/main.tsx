import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";

import Main from "./Pages/Main/Main.tsx";
import "./index.css";
import { Layout } from "./Components/Layout.tsx";
import Leaderboard from "./Pages/Leaderboard/Leaderboard.tsx";
import Shop from "./Pages/Shop/Shop.tsx";
import Login from "./Pages/Login/Login.tsx";
import Register from "./Pages/Register/Register.tsx";
import ResetPassword from "./Pages/ResetPassword/ResetPassword.tsx";
import { isTokenExpired } from "./util/authFunctions.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Main />,
            },
            {
                path: "leaderboard",
                element: (
                    <ProtectedRoute>
                        <Leaderboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "shop",
                element: (
                    <ProtectedRoute>
                        <Shop />
                    </ProtectedRoute>
                ),
            },
            {
                path: "play",
                element: <Main />,
            },
            {
                path: "*",
                element: (
                    <ProtectedRoute>
                        <Main />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/",
        element: <Layout sonar={true} />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "reset-password", element: <ResetPassword /> },
        ],
    },
]);

async function fetchUserData() {
    if (isTokenExpired()) {
        localStorage.clear();
        return;
    }

    const token = localStorage.getItem("access_token");

    const res = await fetch(`${BACKEND_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
    }
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    if (isTokenExpired()) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    useEffect(() => {
        void fetchUserData();
    }, []);
    return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
