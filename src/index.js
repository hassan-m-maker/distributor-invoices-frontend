import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Create root
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// src/index.js (replace service worker registration with this)
if ('serviceWorker' in navigator) {
  // unregister any existing service workers on page load (prevents stale cached builds)
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
      console.log('✅ Cleared service workers');
    }).catch((err) => console.warn('SW unregister failed', err));
  });
}
