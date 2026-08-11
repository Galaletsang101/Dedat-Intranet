import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";

/* DEDAT Design System */
import "./styles/variables.css";
import "./index.css";

import "./styles/cards.css";
import "./styles/buttons.css";
import "./styles/tables.css";
import "./styles/utilities.css";
import "./styles/animations.css";
import "./styles/layout.css";

/* Page-specific styles */
import "./styles/knowledgecenter.css";

import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);