import { createRoot, hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { getRouter } from "./router";

const router = getRouter();

const rootElement = document.getElementById("root");
if (rootElement) {
  if (rootElement.innerHTML) {
    hydrateRoot(rootElement, <StartClient router={router} />);
  } else {
    const root = createRoot(rootElement);
    root.render(<StartClient router={router} />);
  }
}
