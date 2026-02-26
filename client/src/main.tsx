import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

// If the root already has server-rendered content, hydrate; otherwise mount fresh
if (root.innerHTML.trim().length > 0) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
