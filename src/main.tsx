import { createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<StartClient router={router} />);
}