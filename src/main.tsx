import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// global error handlers to assist debugging blank screen issues
if (typeof window !== "undefined") {
  window.onerror = (msg, url, line, col, err) => {
    console.error("GLOBAL ERROR", msg, url, line, col, err);
  };
  window.addEventListener("unhandledrejection", e => {
    console.error("UNHANDLED PROMISE REJECTION", e.reason);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
