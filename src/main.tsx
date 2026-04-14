import { hydrateRoot, createRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

const rootElement = document.getElementById("root");
if (rootElement) {
  if (rootElement.innerHTML.trim()) {
    hydrateRoot(rootElement, <StartClient />);
  } else {
    createRoot(rootElement).render(<StartClient />);
  }
}
