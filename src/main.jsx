import React from "react";
import { createRoot } from "react-dom/client";
import { Lab } from "./Lab.jsx";
import "./lab.css";
import { App } from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {window.location.pathname.startsWith("/lab") ? <Lab /> : <App />}
  </React.StrictMode>,
);
