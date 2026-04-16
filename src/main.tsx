import "./styles.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { createAppRouter } from "./router";

const router = createAppRouter();

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<RouterProvider router={router} />);
}
