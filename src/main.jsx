import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import "./styles/variables.css";
// src/main.jsx or src/index.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/knowledgecenter.css";

import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);