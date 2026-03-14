import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import Main from "./Pages/Main/Main.tsx";
import "./index.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
    },
    {
        path: "/Leaderboard",
        element: <div>Leaderboard</div>,
    },
    {
        path: "/Shop",
        element: <div>Shop</div>,
    },
    {
        path: "/Play",
        element: <Main />,
    },
    {
        path: "*",
        element: <div>404 Not Found</div>,
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
