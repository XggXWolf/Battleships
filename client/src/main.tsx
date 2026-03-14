import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import Main from "./Pages/Main/Main.tsx";
import "./index.css";
import { Layout } from "./Components/Layout.tsx";
import Leaderboard from "./Pages/Leaderboard/Leaderboard.tsx";
import Shop from "./Pages/Shop/Shop.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Main /> },
            { path: "leaderboard", element: <Leaderboard /> },
            { path: "shop", element: <Shop /> },
            { path: "play", element: <Main /> },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
