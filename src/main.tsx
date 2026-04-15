import "./styles.css";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
  // Dispara o evento para o Prerenderer (Puppeteer) capturar o HTML final
  document.dispatchEvent(new Event('render-event'));
}