import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Create root
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// ✅ Register service worker to enable "Add to Home Screen" and offline support
serviceWorkerRegistration.register();
